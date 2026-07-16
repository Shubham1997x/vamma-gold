import { Navbar, WhatsAppIcon } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Catalog } from "@/components/catalog";
import { getSiteSettings, listProducts } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const site = getSiteSettings();
  const products = listProducts();

  return (
    <>
      <Navbar site={site} />
      <main className="flex-1">
        <Hero site={site} />
        <Catalog products={products} site={site} />
      </main>
      <footer className="border-t border-gold/25 bg-maroon-deep py-10 text-center">
        <p className="font-display text-2xl font-semibold text-champagne">
          {site.name}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-gold">
          {site.tagline}
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 text-sm text-ivory/70 sm:flex-row sm:gap-6">
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-champagne"
          >
            <WhatsAppIcon className="size-4" />
            {site.whatsappDisplay}
          </a>
          <span className="hidden text-gold/50 sm:inline">·</span>
          <a
            href={`mailto:${site.enquiryEmail}`}
            className="transition-colors hover:text-champagne"
          >
            {site.enquiryEmail}
          </a>
          <span className="hidden text-gold/50 sm:inline">·</span>
          <span>{site.website}</span>
        </div>
        <p className="mt-6 text-xs text-ivory/40">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </footer>
    </>
  );
}
