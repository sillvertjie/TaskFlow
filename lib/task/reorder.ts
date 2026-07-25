import type { DragEndEvent } from "@dnd-kit/core";

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

function findColumnByTask(columns: Column[], taskId: string) {
  return columns.find((column) =>
    column.tasks.some((task) => task.id === taskId),
  );
}

export function calculateNewColumns(
  current: Column[],
  event: DragEndEvent,
): Column[] {
  const { active, over } = event;

  if (!over) {
    return current;
  }

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

  const movedTask = sourceColumn.tasks.find((task) => task.id === active.id);

  if (!movedTask) {
    return current;
  }

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
}
