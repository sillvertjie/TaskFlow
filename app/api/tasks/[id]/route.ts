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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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

    const { id } = await context.params;

    const task = await getOwnedTask(id, userId);

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

    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      dueDate?: Date | null;
    } = {};

    if (body.title !== undefined) {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          {
            message: "Task title required",
          },
          {
            status: 400,
          },
        );
      }

      data.title = title;
    }

    if (body.description !== undefined) {
      data.description = body.description;
    }

    if (body.priority !== undefined) {
      data.priority = body.priority;
    }

    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      task: updatedTask,
    });
  } catch (error) {
    console.error("PATCH task error:", error);

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

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
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

    const { id } = await context.params;

    const task = await getOwnedTask(id, userId);

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

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Task deleted",
    });
  } catch (error) {
    console.error("DELETE task error:", error);

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
