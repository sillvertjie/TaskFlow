import type { DragEndEvent } from "@dnd-kit/core";
import { describe, expect, it } from "vitest";

import { calculateNewColumns } from "../reorder";

interface TestTask {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  columnId: string;
}

interface TestColumn {
  id: string;
  name: string;
  position: number;
  tasks: TestTask[];
}

describe("calculateNewColumns", () => {
  it("should reorder task inside same column", () => {
    const columns: TestColumn[] = [
      {
        id: "todo",
        name: "Todo",
        position: 0,
        tasks: [
          {
            id: "task-1",
            title: "Task 1",
            description: null,
            priority: "MEDIUM",
            dueDate: null,
            columnId: "todo",
          },
          {
            id: "task-2",
            title: "Task 2",
            description: null,
            priority: "MEDIUM",
            dueDate: null,
            columnId: "todo",
          },
        ],
      },
    ];

    const result = calculateNewColumns(columns, {
      active: {
        id: "task-1",
      },
      over: {
        id: "task-2",
      },
    } as DragEndEvent);

    expect(result[0].tasks[0].id).toBe("task-2");
    expect(result[0].tasks[1].id).toBe("task-1");
  });

  it("should move task between columns", () => {
    const columns: TestColumn[] = [
      {
        id: "todo",
        name: "Todo",
        position: 0,
        tasks: [
          {
            id: "task-1",
            title: "Task 1",
            description: null,
            priority: "MEDIUM",
            dueDate: null,
            columnId: "todo",
          },
        ],
      },
      {
        id: "done",
        name: "Done",
        position: 1,
        tasks: [],
      },
    ];

    const result = calculateNewColumns(columns, {
      active: {
        id: "task-1",
      },
      over: {
        id: "done",
      },
    } as DragEndEvent);

    expect(result[0].tasks).toHaveLength(0);

    expect(result[1].tasks).toHaveLength(1);
    expect(result[1].tasks[0].id).toBe("task-1");
    expect(result[1].tasks[0].columnId).toBe("done");
  });
});
