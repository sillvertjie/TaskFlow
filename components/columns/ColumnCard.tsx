"use client";

import { useDroppable } from "@dnd-kit/core";

import TaskList from "@/components/tasks/TaskList";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  columnId: string;
}

interface ColumnCardProps {
  id: string;
  name: string;
  tasks: Task[];
  onRefresh: () => void;
}

export default function ColumnCard({
  id,
  name,
  tasks,
  onRefresh,
}: ColumnCardProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex min-h-72 flex-col rounded-lg border bg-white p-4 shadow-sm"
    >
      <h2 className="font-semibold text-gray-900">{name}</h2>

      <TaskList columnId={id} tasks={tasks} onRefresh={onRefresh} />
    </div>
  );
}
