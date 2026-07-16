"use client";

import { useRouter } from "next/navigation";

const STATUSES = ["new", "contacted", "closed"];

export function EnquiryStatusSelect({ id, status }: { id: number; status: string }) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    router.refresh();
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      className="cursor-pointer rounded-md border border-gold/40 bg-white px-2 py-1 text-xs font-semibold text-ink"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
