"use client";

import { useState } from "react";

interface CreateBoardFormProps {
  onCreated: () => void;
}

export default function CreateBoardForm({ onCreated }: CreateBoardFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create board");
      }

      setName("");
      onCreated();
    } catch {
      setError("Failed to create board");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="rounded border px-3 py-2"
        placeholder="Board name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-foreground px-4 py-2 text-background disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
