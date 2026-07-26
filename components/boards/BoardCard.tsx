"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/lib/toast/context";

interface BoardCardProps {
  id: string;
  name: string;
  onDeleted: () => void;
}

export default function BoardCard({ id, name, onDeleted }: BoardCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error();
      }

      showToast("Board deleted", "success");
      onDeleted();
    } catch {
      showToast("Failed to delete board", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => router.push(`/boards/${id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            router.push(`/boards/${id}`);
          }
        }}
        className="
          relative
          flex
          h-72
          flex-col
          rounded-lg
          border
          p-4
          shadow-sm
          bg-white
          dark:bg-gray-900
          border-gray-200
          dark:border-gray-700
          cursor-pointer
        "
      >
        <h2 className="pr-16 font-semibold">{name}</h2>

        <button
          onClick={(event) => {
            event.stopPropagation();
            setConfirmOpen(true);
          }}
          className="
            absolute
            top-4
            right-4
            rounded
            bg-red-600
            px-3
            py-1
            text-sm
            text-white
            hover:bg-red-700
          "
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete board"
        description={`Are you sure you want to delete "${name}"? This will also delete all columns and tasks inside it.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
