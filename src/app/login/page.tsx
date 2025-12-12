"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isAuth = useAuthStore((s) => s.isAuthenticated());
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadFromStorage();
    if (isAuth) router.replace("/budget");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email.trim(), password);
    if (ok) {
      router.replace("/budget");
    } else {
      setError("Invalid credentials. Use the demo email/password provided.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sign in to BudgetBox</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hire-me@anshumat.org"
              className="w-full p-2 rounded border bg-gray-900"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="HireMe@2025!"
              className="w-full p-2 rounded border bg-gray-900"
              type="password"
              required
            />
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded text-white font-medium"
          >
            Login
          </button>

          <div className="text-xs text-gray-400 mt-2">
            Use demo: <span className="text-white">hire-me@anshumat.org</span> /{" "}
            <span className="text-white">HireMe@2025!</span>
          </div>
        </form>
      </div>
    </div>
  );
}
