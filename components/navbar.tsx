import type { Site } from "@/lib/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.57 14.86L2 22l5.3-1.39A9.9 9.9 0 1 0 12.04 2Zm5.82 14.12c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.01.24-3.4-.71-2.87-1.13-4.68-4.06-4.82-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35l.55.01c.18 0 .41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.3-.28.47l-.42.5c-.14.14-.29.29-.12.57.16.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.17-.19.71-.82.89-1.11.19-.28.38-.23.63-.14.26.1 1.64.78 1.92.92.28.14.47.21.54.33.07.12.07.68-.15 1.3Z" />
    </svg>
  );
}

export { WhatsAppIcon };

export function Navbar({ site }: { site: Site }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-maroon-deep/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-wide text-champagne">
            Samor Gold
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.22em] text-gold sm:inline">
            {site.tagline}
          </span>
        </a>
        <nav className="flex items-center gap-5">
          <a
            href="#collection"
            className="text-sm font-medium text-ivory/80 transition-colors hover:text-champagne"
          >
            Collection
          </a>
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-gold/50 px-4 text-sm font-semibold text-champagne transition-colors hover:bg-gold hover:text-maroon-deep"
          >
            <WhatsAppIcon className="size-4" />
            <span className="hidden sm:inline">{site.whatsappDisplay}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
