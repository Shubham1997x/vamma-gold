"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewUserForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);
    if (res.ok) {
      setUsername("");
      setPassword("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create user");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="new-username" className="mb-1 block text-xs font-semibold text-ink">
          Username
        </label>
        <Input
          id="new-username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-10 w-48 text-sm"
        />
      </div>
      <div>
        <label htmlFor="new-password" className="mb-1 block text-xs font-semibold text-ink">
          Password (min 8 chars)
        </label>
        <Input
          id="new-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10 w-48 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={loading} className="cursor-pointer">
        {loading ? "Adding…" : "Add Admin"}
      </Button>
      {error && <p className="basis-full text-sm text-red-700">{error}</p>}
    </form>
  );
}
