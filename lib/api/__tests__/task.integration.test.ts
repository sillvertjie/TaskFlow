import { describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

import { POST as createBoard } from "@/app/api/boards/route";
import { POST as createColumn } from "@/app/api/boards/[id]/columns/route";
import { POST as createTask } from "@/app/api/columns/[id]/tasks/route";
import {
  PATCH as updateTask,
  DELETE as deleteTask,
} from "@/app/api/tasks/[id]/route";

import { ApiClient } from "./helpers/api-client";
import { createTestUser } from "./helpers/auth";

describe("Task API Integration", () => {
  it("should create update and delete task", async () => {
    const client = new ApiClient();

    const user = await createTestUser(client);

    expect(user.email).toBeDefined();

    const boardResponse = await client.request(createBoard, {
      method: "POST",
      body: JSON.stringify({
        name: "Test Board",
      }),
    });

    expect(boardResponse.status).toBe(201);

    const { board } = await boardResponse.json();

    const columnResponse = await client.request(createColumn, {
      method: "POST",
      params: {
        id: board.id,
      },
      body: JSON.stringify({
        name: "Todo",
      }),
    });

    expect(columnResponse.status).toBe(201);

    const { column } = await columnResponse.json();

    const taskResponse = await client.request(createTask, {
      method: "POST",
      params: {
        id: column.id,
      },
      body: JSON.stringify({
        title: "Integration Task",
        priority: "HIGH",
      }),
    });

    expect(taskResponse.status).toBe(201);

    const { task } = await taskResponse.json();

    const updateResponse = await client.request(updateTask, {
      method: "PATCH",
      params: {
        id: task.id,
      },
      body: JSON.stringify({
        title: "Updated Task",
      }),
    });

    expect(updateResponse.status).toBe(200);

    const deleteResponse = await client.request(deleteTask, {
      method: "DELETE",
      params: {
        id: task.id,
      },
    });

    expect(deleteResponse.status).toBe(200);

    const deleted = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(deleted).toBeNull();
  });

  it("should reject another user accessing task", async () => {
    const clientA = new ApiClient();

    await createTestUser(clientA);

    const boardResponse = await clientA.request(createBoard, {
      method: "POST",
      body: JSON.stringify({
        name: "Private Board",
      }),
    });

    const { board } = await boardResponse.json();

    const columnResponse = await clientA.request(createColumn, {
      method: "POST",
      params: {
        id: board.id,
      },
      body: JSON.stringify({
        name: "Todo",
      }),
    });

    const { column } = await columnResponse.json();

    const taskResponse = await clientA.request(createTask, {
      method: "POST",
      params: {
        id: column.id,
      },
      body: JSON.stringify({
        title: "Private Task",
      }),
    });

    const { task } = await taskResponse.json();

    const clientB = new ApiClient();

    await createTestUser(clientB);

    const response = await clientB.request(updateTask, {
      method: "PATCH",
      params: {
        id: task.id,
      },
      body: JSON.stringify({
        title: "Should Fail",
      }),
    });

    expect(response.status).toBe(404);
  });
});
