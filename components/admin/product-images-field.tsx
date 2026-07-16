"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function ProductImagesField({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (res.ok) {
      const data = await res.json();
      onChange([...images, ...data.paths]);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed");
    }
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink">Images</label>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={`${img}-${i}`} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-gold/30 bg-ivory-soft">
                <Image src={img} alt={`Image ${i + 1}`} fill sizes="120px" className="object-cover" />
              </div>
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-maroon-deep/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-champagne">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-maroon-deep/80 text-champagne opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
              <div className="mt-1 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="cursor-pointer text-xs text-clay hover:text-ink disabled:opacity-30"
                  aria-label="Move earlier"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="cursor-pointer text-xs text-clay hover:text-ink disabled:opacity-30"
                  aria-label="Move later"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="block text-sm text-clay file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-gold file:bg-white file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-gold-deep hover:file:bg-gold hover:file:text-maroon-deep"
      />
      {uploading && <p className="mt-1 text-xs text-clay">Uploading…</p>}

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {images.length === 0 && (
        <p className="mt-2 text-xs text-clay">At least one image is required.</p>
      )}
    </div>
  );
}
