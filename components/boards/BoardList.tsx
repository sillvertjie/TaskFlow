"use client";

import { useEffect, useState } from "react";

import BoardCard from "./BoardCard";
import CreateBoardForm from "./CreateBoardForm";

import EmptyState from "@/components/ui/EmptyState";

interface Board {
  id: string;
  name: string;
}

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBoards() {
    try {
      setError(null);

      const response = await fetch("/api/boards");

      if (!response.ok) {
        throw new Error("Failed to load boards");
      }

      const data = await response.json();

      setBoards(data.boards);
    } catch {
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBoards() {
      try {
        setError(null);

        const response = await fetch("/api/boards", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setBoards(data.boards);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load boards");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBoards();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <p>Loading boards...</p>;
  }

  return (
    <section className="space-y-6">
      <CreateBoardForm onCreated={loadBoards} />

      {error && <p className="text-red-500">{error}</p>}

      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create your first board to start organizing your work."
        />
      ) : (
        <div className="grid gap-4">
          {boards.map((board) => (
            <BoardCard key={board.id} id={board.id} name={board.name} />
          ))}
        </div>
      )}
    </section>
  );
}
