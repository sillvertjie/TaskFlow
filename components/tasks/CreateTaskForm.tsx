"use client";

import { useEffect, useRef, useState } from "react";

import { useToast } from "@/lib/toast/context";

interface CreateTaskFormProps {
  columnId: string;
  onCreated: () => void;
  shortcutEnabled?: boolean;
}

export default function CreateTaskForm({
  columnId,
  onCreated,
  shortcutEnabled = false,
}: CreateTaskFormProps) {
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("MEDIUM");

  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortcutEnabled) {
      return;
    }

    function handleKeyboard(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();

        titleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [shortcutEnabled]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Task title required");

      showToast("Task title required", "error");

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

      showToast("Task created successfully", "success");

      onCreated();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);

        showToast(error.message, "error");
      } else {
        setError("Failed to create task");

        showToast("Failed to create task", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        ref={titleRef}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        disabled={loading}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        disabled={loading}
        className="
    w-full
    rounded-lg
    border
    bg-background
    px-3
    py-2
    text-sm
    text-foreground
    placeholder:text-gray-400
  "
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        disabled={loading}
        className="
   w-full
   rounded-lg
   border
   bg-background
   px-3
   py-2
   text-sm
   text-foreground
   placeholder:text-gray-400
 "
      >
        <option value="LOW">Low</option>

        <option value="MEDIUM">Medium</option>

        <option value="HIGH">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        disabled={loading}
        className="
    w-full
    rounded-lg
    border
    bg-background
    px-3
    py-2
    text-sm
text-foreground
    dark:text-white
    dark:color-scheme:dark
  "
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        className="
    rounded
    bg-foreground
    px-3
    py-2
    text-sm
    text-background
    disabled:opacity-50
  "
      >
        Add Task
      </button>
    </form>
  );
}
