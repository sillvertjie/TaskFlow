"use client";

import { useCallback, useEffect, useState } from "react";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";

import EmptyState from "@/components/ui/EmptyState";

import ColumnCard from "./ColumnCard";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  columnId: string;
}

interface Column {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
}

interface ColumnListProps {
  boardId: string;
}

export default function ColumnList({ boardId }: ColumnListProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadColumns = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(`/api/boards/${boardId}/columns`);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      const result = await Promise.all(
        data.columns.map(async (column: Omit<Column, "tasks">) => {
          const tasksResponse = await fetch(`/api/columns/${column.id}/tasks`);

          const tasksData = await tasksResponse.json();

          return {
            ...column,
            tasks: tasksData.tasks,
          };
        }),
      );

      setColumns(result);
    } catch {
      setError("Failed to load columns");
    }
  }, [boardId]);

  useEffect(() => {
    async function init() {
      await loadColumns();
      setLoading(false);
    }

    init();
  }, [loadColumns]);

  function findColumnByTask(columns: Column[], taskId: string) {
    return columns.find((column) =>
      column.tasks.some((task) => task.id === taskId),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    setColumns((current) => {
      const sourceColumn = findColumnByTask(current, String(active.id));

      if (!sourceColumn) {
        return current;
      }

      const targetColumn =
        current.find((column) => column.id === over.id) ??
        findColumnByTask(current, String(over.id));

      if (!targetColumn) {
        return current;
      }

      const movedTask = sourceColumn.tasks.find(
        (task) => task.id === active.id,
      );

      if (!movedTask) {
        return current;
      }

      // DEV-023 reorder dalam column
      if (sourceColumn.id === targetColumn.id) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === active.id,
        );

        const newIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === over.id,
        );

        if (oldIndex === -1 || newIndex === -1) {
          return current;
        }

        const reordered = [...sourceColumn.tasks];

        const [removed] = reordered.splice(oldIndex, 1);

        reordered.splice(newIndex, 0, removed);

        return current.map((column) =>
          column.id === sourceColumn.id
            ? {
                ...column,
                tasks: reordered,
              }
            : column,
        );
      }

      // DEV-024 pindah antar column
      return current.map((column) => {
        if (column.id === sourceColumn.id) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== movedTask.id),
          };
        }

        if (column.id === targetColumn.id) {
          return {
            ...column,
            tasks: [
              ...column.tasks,
              {
                ...movedTask,
                columnId: column.id,
              },
            ],
          };
        }

        return column;
      });
    });
  }

  if (loading) {
    return <p>Loading columns...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (columns.length === 0) {
    return (
      <EmptyState
        title="No columns yet"
        description="Create your first column to start organizing this board."
      />
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            id={column.id}
            name={column.name}
            tasks={column.tasks}
            onRefresh={loadColumns}
          />
        ))}
      </div>
    </DndContext>
  );
}
