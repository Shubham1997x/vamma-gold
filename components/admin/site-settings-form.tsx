"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Site } from "@/lib/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteSettingsForm({ initial }: { initial: Site }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof Site>(key: K, value: Site[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save");
    }
  }

  const fields: { key: keyof Site; label: string }[] = [
    { key: "name", label: "Store name" },
    { key: "tagline", label: "Tagline" },
    { key: "whatsappNumber", label: "WhatsApp number (digits, with country code)" },
    { key: "whatsappDisplay", label: "WhatsApp number (display)" },
    { key: "enquiryEmail", label: "Enquiry email" },
    { key: "website", label: "Website" },
  ];

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="mb-1 block text-xs font-semibold text-ink">
            {f.label}
          </label>
          <Input
            id={f.key}
            required
            value={values[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            className="h-11 text-sm"
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-green-700">Saved.</p>}

      <Button type="submit" disabled={loading} className="cursor-pointer">
        {loading ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
