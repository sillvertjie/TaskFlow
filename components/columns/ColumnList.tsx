"use client";

import { useEffect, useState } from "react";

import ColumnCard from "./ColumnCard";

interface Column {
  id: string;
  name: string;
  position: number;
}

interface ColumnListProps {
  boardId: string;
}

export default function ColumnList({ boardId }: ColumnListProps) {
  const [columns, setColumns] = useState<Column[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadColumns() {
      try {
        const response = await fetch(`/api/boards/${boardId}/columns`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setColumns(data.columns);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load columns");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadColumns();

    return () => {
      controller.abort();
    };
  }, [boardId]);

  if (loading) {
    return <p>Loading columns...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (columns.length === 0) {
    return <p>No columns yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((column) => (
        <ColumnCard key={column.id} name={column.name} />
      ))}
    </div>
  );
}
