import { listAdminUsers } from "@/lib/db/queries";
import { DeleteButton } from "@/components/admin/delete-button";
import { NewUserForm } from "@/components/admin/new-user-form";

export default async function AdminUsersPage() {
  const users = listAdminUsers();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Admin Users</h1>

      <div className="mt-6 rounded-2xl border border-gold/25 bg-white p-5">
        <NewUserForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/25 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gold/20 text-[10px] font-semibold uppercase tracking-[0.15em] text-clay">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gold/10 last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{u.username}</td>
                <td className="px-4 py-3 text-clay">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    url={`/api/admin/users/${u.id}`}
                    confirmMessage={`Delete admin user ${u.username}?`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
