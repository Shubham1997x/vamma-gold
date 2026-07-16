import { listEnquiries } from "@/lib/db/queries";
import { EnquiryStatusSelect } from "@/components/admin/enquiry-status-select";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminEnquiriesPage() {
  const enquiries = listEnquiries();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Enquiries</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/25 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gold/20 text-[10px] font-semibold uppercase tracking-[0.15em] text-clay">
            <tr>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-gold/10 align-top last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-clay">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-ink">
                  {e.productName ?? "—"}
                  {e.productCode && (
                    <span className="ml-1 text-xs text-gold-deep">({e.productCode})</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink">{e.name}</td>
                <td className="px-4 py-3 text-clay">{e.phone}</td>
                <td className="px-4 py-3 text-clay">{e.email ?? "—"}</td>
                <td className="px-4 py-3 max-w-xs text-clay">{e.message ?? "—"}</td>
                <td className="px-4 py-3">
                  <EnquiryStatusSelect id={e.id} status={e.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    url={`/api/admin/enquiries/${e.id}`}
                    confirmMessage="Delete this enquiry?"
                  />
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-clay">
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
