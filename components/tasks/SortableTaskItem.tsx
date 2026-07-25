"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskItem from "./TaskItem";

interface SortableTaskItemProps {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function SortableTaskItem({
  id,
  title,
  description,
  priority,
  dueDate,
  onUpdated,
  onDeleted,
}: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem
        id={id}
        title={title}
        description={description}
        priority={priority}
        dueDate={dueDate}
        onUpdated={onUpdated}
        onDeleted={onDeleted}
      />
    </div>
  );
}
