import { describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

import { POST as createBoard } from "@/app/api/boards/route";
import {
  GET as getBoard,
  DELETE as deleteBoard,
} from "@/app/api/boards/[id]/route";
import { POST as createColumn } from "@/app/api/boards/[id]/columns/route";
import { DELETE as deleteColumn } from "@/app/api/columns/[id]/route";
import { POST as createTask } from "@/app/api/columns/[id]/tasks/route";

import { ApiClient } from "./helpers/api-client";
import { createTestUser } from "./helpers/auth";

async function createOwnedBoard(client: ApiClient, name: string) {
  const response = await client.request(createBoard, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  const { board } = await response.json();

  return board;
}

async function createOwnedColumn(
  client: ApiClient,
  boardId: string,
  name: string,
) {
  const response = await client.request(createColumn, {
    method: "POST",
    params: { id: boardId },
    body: JSON.stringify({ name }),
  });

  const { column } = await response.json();

  return column;
}

describe("Board & Column Ownership", () => {
  it("should reject another user viewing a board", async () => {
    const clientA = new ApiClient();
    await createTestUser(clientA);

    const board = await createOwnedBoard(clientA, "Private Board");

    const clientB = new ApiClient();
    await createTestUser(clientB);

    const response = await clientB.request(getBoard, {
      method: "GET",
      params: { id: board.id },
    });

    expect(response.status).toBe(404);
  });

  it("should reject another user deleting a board", async () => {
    const clientA = new ApiClient();
    await createTestUser(clientA);

    const board = await createOwnedBoard(clientA, "Private Board");

    const clientB = new ApiClient();
    await createTestUser(clientB);

    const response = await clientB.request(deleteBoard, {
      method: "DELETE",
      params: { id: board.id },
    });

    expect(response.status).toBe(404);

    const stillExists = await prisma.board.findUnique({
      where: { id: board.id },
    });

    expect(stillExists).not.toBeNull();
  });

  it("should reject another user creating a column on someone else's board", async () => {
    const clientA = new ApiClient();
    await createTestUser(clientA);

    const board = await createOwnedBoard(clientA, "Private Board");

    const clientB = new ApiClient();
    await createTestUser(clientB);

    const response = await clientB.request(createColumn, {
      method: "POST",
      params: { id: board.id },
      body: JSON.stringify({ name: "Should Fail" }),
    });

    expect(response.status).toBe(404);
  });

  it("should reject another user deleting a column", async () => {
    const clientA = new ApiClient();
    await createTestUser(clientA);

    const board = await createOwnedBoard(clientA, "Private Board");
    const column = await createOwnedColumn(clientA, board.id, "Todo");

    const clientB = new ApiClient();
    await createTestUser(clientB);

    const response = await clientB.request(deleteColumn, {
      method: "DELETE",
      params: { id: column.id },
    });

    expect(response.status).toBe(404);

    const stillExists = await prisma.column.findUnique({
      where: { id: column.id },
    });

    expect(stillExists).not.toBeNull();
  });

  it("should reject another user creating a task on someone else's column", async () => {
    const clientA = new ApiClient();
    await createTestUser(clientA);

    const board = await createOwnedBoard(clientA, "Private Board");
    const column = await createOwnedColumn(clientA, board.id, "Todo");

    const clientB = new ApiClient();
    await createTestUser(clientB);

    const response = await clientB.request(createTask, {
      method: "POST",
      params: { id: column.id },
      body: JSON.stringify({ title: "Should Fail" }),
    });

    expect(response.status).toBe(404);
  });
});
