import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { taskSchema } from "@/lib/validators/task";

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

    const result = taskSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid task input",
          errors: result.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const { title, description, priority, dueDate } = result.data;

    const data: {
      title?: string;
      description?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      dueDate?: Date | null;
    } = {};

    if (title !== undefined) {
      data.title = title;
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (priority !== undefined) {
      data.priority = priority;
    }

    if (dueDate !== undefined) {
      if (!dueDate) {
        data.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            {
              message: "Invalid due date",
            },
            {
              status: 400,
            },
          );
        }

        data.dueDate = parsedDate;
      }
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
