"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const response = await fetch("/api/me");

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setUser(data.user);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">TaskFlow</h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-700">{user.email}</span>

            <button
              onClick={handleLogout}
              className="rounded bg-black px-4 py-2 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
