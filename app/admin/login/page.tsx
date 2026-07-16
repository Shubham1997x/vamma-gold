"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gold/30 bg-ivory p-8 shadow-2xl"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
          Vamma Gold
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Admin Login</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-semibold text-ink">
              Username
            </label>
            <Input
              id="username"
              autoFocus
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-ink">
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 text-sm"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <Button type="submit" className="mt-6 w-full cursor-pointer" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
