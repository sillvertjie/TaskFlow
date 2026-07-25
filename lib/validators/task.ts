import { z } from "zod";

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title required"),

  description: z.string().nullable().optional(),

  priority: taskPrioritySchema.optional(),

  dueDate: z.string().nullable().optional(),
});
