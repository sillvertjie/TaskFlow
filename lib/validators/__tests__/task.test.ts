import { describe, expect, it } from "vitest";

import { taskSchema } from "../task";

describe("taskSchema", () => {
  it("accepts valid task input", () => {
    const result = taskSchema.safeParse({
      title: "Test task",
      description: "Description",
      priority: "HIGH",
      dueDate: "2026-03-23",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = taskSchema.safeParse({
      title: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts nullable description", () => {
    const result = taskSchema.safeParse({
      title: "Task without description",
      description: null,
    });

    expect(result.success).toBe(true);
  });
});
