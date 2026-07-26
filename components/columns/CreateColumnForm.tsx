"use client";

import { useState } from "react";

interface CreateColumnFormProps {
  boardId: string;
  onCreated: () => void;
}

export default function CreateColumnForm({
  boardId,
  onCreated,
}: CreateColumnFormProps) {
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
      const response = await fetch(`/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create column");
      }

      setName("");
      onCreated();
    } catch {
      setError("Failed to create column");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        className="rounded border border-foreground/20 bg-background px-3 py-2 text-foreground"
        placeholder="Column name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-foreground px-4 py-2 text-background disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Column"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
