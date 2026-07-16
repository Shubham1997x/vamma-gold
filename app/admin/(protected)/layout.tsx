import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SidebarNav } from "@/components/admin/sidebar-nav";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-ivory-soft">
      <aside className="w-64 shrink-0 bg-maroon-deep p-6">
        <SidebarNav />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
