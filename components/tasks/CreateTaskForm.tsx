"use client";

import { useState } from "react";

interface CreateTaskFormProps {
  columnId: string;
  onCreated: () => void;
}

export default function CreateTaskForm({
  columnId,
  onCreated,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/columns/${columnId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          priority,
          dueDate: dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to create task");
      }

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");

      onCreated();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create task");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
        disabled={loading}
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
        disabled={loading}
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
        disabled={loading}
      >
        <option value="LOW">Low</option>

        <option value="MEDIUM">Medium</option>

        <option value="HIGH">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900"
        disabled={loading}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Task"}
      </button>
    </form>
  );
}
