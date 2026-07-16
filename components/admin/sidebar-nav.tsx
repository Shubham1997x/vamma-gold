"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/site", label: "Site Settings" },
  { href: "/admin/users", label: "Users" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col justify-between">
      <div>
        <Link href="/admin" className="block px-1">
          <span className="font-display text-2xl font-semibold text-champagne">
            Vamma Gold
          </span>
          <span className="mt-0.5 block text-[10px] uppercase tracking-[0.25em] text-gold">
            Admin
          </span>
        </Link>
        <ul className="mt-8 space-y-1">
          {links.map((link) => {
            const active =
              link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-gold text-maroon-deep"
                      : "text-ivory/80 hover:bg-white/10 hover:text-champagne"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ivory/80 transition-colors hover:bg-white/10 hover:text-champagne"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
          </svg>
          View Website
        </a>
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-ivory/70 transition-colors hover:bg-white/10 hover:text-champagne"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
