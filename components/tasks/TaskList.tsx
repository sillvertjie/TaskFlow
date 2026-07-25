"use client";

import { useEffect, useState } from "react";

import CreateTaskForm from "./CreateTaskForm";

import TaskItem from "./TaskItem";

interface Task {
  id: string;
  title: string;
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

  if (loading) {
    return <p className="mt-4 text-sm text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
      {error && <p className="text-sm text-red-500">{error}</p>}

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              onUpdated={refreshTasks}
              onDeleted={refreshTasks}
            />
          ))}
        </div>
      )}

      <CreateTaskForm columnId={columnId} onCreated={refreshTasks} />
    </div>
  );
}
