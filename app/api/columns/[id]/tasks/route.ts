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

async function getOwnedColumn(columnId: string, userId: string) {
  return prisma.column.findFirst({
    where: {
      id: columnId,
      board: {
        userId,
      },
    },
  });
}

export async function GET(
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

    const column = await getOwnedColumn(id, userId);

    if (!column) {
      return NextResponse.json(
        {
          message: "Column not found",
        },
        {
          status: 404,
        },
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        columnId: id,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      tasks,
    });
  } catch (error) {
    console.error("GET tasks error:", error);

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

export async function POST(
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

    const column = await getOwnedColumn(id, userId);

    if (!column) {
      return NextResponse.json(
        {
          message: "Column not found",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const title = body.title?.trim();

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

    const lastTask = await prisma.task.findFirst({
      where: {
        columnId: id,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        position,
        columnId: id,
      },
    });

    return NextResponse.json(
      {
        task,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST task error:", error);

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
