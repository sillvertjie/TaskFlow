import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

async function getUserId() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);

  return payload?.userId ?? null;
}

async function getOwnedTask(taskId: string, userId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      column: {
        board: {
          userId,
        },
      },
    },
  });
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const tasks = body.tasks;

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        {
          message: "Invalid tasks payload",
        },
        {
          status: 400,
        },
      );
    }

    for (const item of tasks) {
      const task = await getOwnedTask(item.id, userId);

      if (!task) {
        return NextResponse.json(
          {
            message: "Task not found",
          },
          {
            status: 404,
          },
        );
      }
    }

    await prisma.$transaction(
      tasks.map((item) =>
        prisma.task.update({
          where: {
            id: item.id,
          },
          data: {
            position: item.position,
            ...(item.columnId && {
              columnId: item.columnId,
            }),
          },
        }),
      ),
    );

    return NextResponse.json({
      message: "Task order updated",
    });
  } catch (error) {
    console.error("POST /api/tasks/reorder error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
