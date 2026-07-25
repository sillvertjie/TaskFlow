"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ThemeToggle from "@/components/theme/ThemeToggle";

interface User {
  id: string;
  email: string;
}

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/me");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } finally {
        setLoading(false);
      }
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
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        px-6
        py-4

        bg-white
        dark:bg-gray-900

        border-gray-200
        dark:border-gray-700
      "
    >
      <h1
        className="
          text-xl
          font-bold
          text-gray-900
          dark:text-white
        "
      >
        TaskFlow
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {!loading && user && (
          <>
            <span
              className="
                text-sm
                text-gray-700
                dark:text-gray-300
              "
            >
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="
                rounded
                bg-black
                px-4
                py-2
                text-white

                dark:bg-white
                dark:text-black
              "
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
