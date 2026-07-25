"use client";

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
  columnId: string;
}

interface TaskListProps {
  columnId: string;
  tasks: Task[];
  onRefresh: () => void;
  shortcutEnabled?: boolean;
}

export default function TaskList({
  columnId,
  tasks,
  onRefresh,
  shortcutEnabled = false,
}: TaskListProps) {
  return (
    <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet</p>
      ) : (
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
                onUpdated={onRefresh}
                onDeleted={onRefresh}
              />
            ))}
          </div>
        </SortableContext>
      )}

      <CreateTaskForm
        columnId={columnId}
        onCreated={onRefresh}
        shortcutEnabled={shortcutEnabled}
      />
    </div>
  );
}
