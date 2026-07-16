import Link from "next/link";
import { getSiteSettings, listEnquiries, listProducts } from "@/lib/db/queries";

export default async function AdminDashboardPage() {
  const [products, enquiries, site] = await Promise.all([
    listProducts(),
    listEnquiries(),
    getSiteSettings(),
  ]);
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const cards = [
    { label: "Products", value: products.length, href: "/admin/products" },
    { label: "New Enquiries", value: newEnquiries, href: "/admin/enquiries" },
    { label: "Total Enquiries", value: enquiries.length, href: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-clay">
        Managing {site.name} — {site.tagline}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gold/25 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
              {card.label}
            </p>
            <p className="mt-2 font-display text-4xl font-semibold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
