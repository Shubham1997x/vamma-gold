"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  url,
  confirmMessage,
  label = "Delete",
}: {
  url: string;
  confirmMessage: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to delete");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="cursor-pointer text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
    >
      {loading ? "Deleting…" : label}
    </button>
  );
}
