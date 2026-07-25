"use client";

import { useEffect, useState } from "react";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import CreateTaskForm from "./CreateTaskForm";
import SortableTaskItem from "./SortableTaskItem";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
}

interface TaskListProps {
  columnId: string;
}

export default function TaskList({ columnId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshTasks() {
    try {
      setError(null);

      const response = await fetch(`/api/columns/${columnId}/tasks`);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setTasks(data.tasks);
    } catch {
      setError("Failed to load tasks");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTasks() {
      try {
        const response = await fetch(`/api/columns/${columnId}/tasks`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();

        setTasks(data.tasks);
      } catch {
        if (!controller.signal.aborted) {
          setError("Failed to load tasks");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTasks();

    return () => {
      controller.abort();
    };
  }, [columnId]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setTasks((currentTasks) => {
      const oldIndex = currentTasks.findIndex((task) => task.id === active.id);

      const newIndex = currentTasks.findIndex((task) => task.id === over.id);

      const updatedTasks = [...currentTasks];

      const [movedTask] = updatedTasks.splice(oldIndex, 1);

      updatedTasks.splice(newIndex, 0, movedTask);

      return updatedTasks;
    });
  }

  if (loading) {
    return <p className="mt-4 text-sm text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
      {error && <p className="text-sm text-red-500">{error}</p>}

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  dueDate={task.dueDate}
                  onUpdated={refreshTasks}
                  onDeleted={refreshTasks}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CreateTaskForm columnId={columnId} onCreated={refreshTasks} />
    </div>
  );
}
