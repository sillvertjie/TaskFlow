"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/lib/toast/context";

interface TaskItemProps {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function TaskItem({
  id,
  title,
  description,
  priority,
  dueDate,
  onUpdated,
  onDeleted,
}: TaskItemProps) {
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState(title);
  const [descriptionValue, setDescriptionValue] = useState(description ?? "");

  const [priorityValue, setPriorityValue] = useState(priority);

  const [dueDateValue, setDueDateValue] = useState(
    dueDate ? dueDate.slice(0, 10) : "",
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  async function handleUpdate() {
    if (!value.trim()) {
      setError("Task title required");
      showToast("Task title required", "error");
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
          description: descriptionValue || null,
          priority: priorityValue,
          dueDate: dueDateValue || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update task");
      }

      setEditing(false);

      showToast("Task updated successfully", "success");

      onUpdated();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        showToast(error.message, "error");
      } else {
        setError("Failed to update task");
        showToast("Failed to update task", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
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

      showToast("Task deleted successfully", "success");

      onDeleted();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        showToast(error.message, "error");
      } else {
        setError("Failed to delete task");
        showToast("Failed to delete task", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  function cancelEdit() {
    setEditing(false);
    setValue(title);
    setDescriptionValue(description ?? "");
    setPriorityValue(priority);
    setDueDateValue(dueDate ? dueDate.slice(0, 10) : "");
    setError(null);
  }

  return (
    <div
      className="
        rounded
        border
        bg-gray-50
        p-3
        dark:border-gray-700
        dark:bg-gray-800
      "
    >
      {editing ? (
        <div className="space-y-2">
          <input
            type="date"
            value={dueDateValue}
            onChange={(event) => setDueDateValue(event.target.value)}
            className="
    w-full
    rounded
    border
    bg-background
    px-2
    py-1
    text-sm
    text-foreground
    dark:text-white
    dark:color-scheme:dark
  "
            disabled={loading}
          />

          <textarea
            value={descriptionValue}
            onChange={(event) => setDescriptionValue(event.target.value)}
            placeholder="Description"
            className="
              w-full
              rounded
              border
              bg-background
              px-2
              py-1
              text-sm
              text-foreground
            "
            disabled={loading}
          />

          <select
            value={priorityValue}
            onChange={(event) =>
              setPriorityValue(event.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="
              w-full
              rounded
              border
              bg-background
              px-2
              py-1
              text-sm
              text-foreground
            "
            disabled={loading}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <input
            type="date"
            value={dueDateValue}
            onChange={(event) => setDueDateValue(event.target.value)}
            className="
              w-full
              rounded
              border
              bg-background
              px-2
              py-1
              text-sm
              text-foreground
            "
            disabled={loading}
          />
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>

          <p
            className="
              mt-2
              text-sm
              text-gray-600
              dark:text-gray-300
            "
          >
            {description || "No description"}
          </p>

          <p
            className="
              mt-2
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Priority: {priority}
          </p>

          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Due date: {dueDate ? dueDate.slice(0, 10) : "-"}
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-3 flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="
                rounded
                bg-black
                px-3
                py-1
                text-sm
                text-white
                disabled:opacity-50
                dark:bg-white
                dark:text-black
              "
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={cancelEdit}
              disabled={loading}
              className="
                rounded
                border
                bg-background
                px-3
                py-1
                text-sm
                text-foreground
              "
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className="
                rounded
                border
                bg-background
                px-3
                py-1
                text-sm
                text-foreground
              "
            >
              Edit
            </button>

            <button
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
              className="
                rounded
                bg-red-600
                px-3
                py-1
                text-sm
                text-white
                disabled:opacity-50
              "
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </>
        )}
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete task?"
        description="This action cannot be undone. The task will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          handleDelete();
        }}
      />
    </div>
  );
}
