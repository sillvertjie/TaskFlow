"use client";

import { useState } from "react";

interface TaskItemProps {
  id: string;
  title: string;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function TaskItem({
  id,
  title,
  onUpdated,
  onDeleted,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState(title);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    if (!value.trim()) {
      setError("Task title required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update task");
      }

      setEditing(false);

      onUpdated();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update task");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to delete task");
      }

      onDeleted();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete task");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded border bg-gray-50 p-3">
      {editing ? (
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded border bg-white px-2 py-1 text-sm text-gray-900 placeholder-gray-400"
          disabled={loading}
        />
      ) : (
        <p className="text-sm font-medium text-gray-900">{title}</p>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-3 flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="rounded bg-black px-3 py-1 text-sm text-white"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setValue(title);
              }}
              disabled={loading}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
