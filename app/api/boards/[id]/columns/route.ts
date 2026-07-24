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

async function getOwnedBoard(id: string, userId: string) {
  return prisma.board.findFirst({
    where: {
      id: id,
      userId,
    },
  });
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      boardId: string;
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

    const { boardId } = await context.params;

    const board = await getOwnedBoard(boardId, userId);

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        {
          status: 404,
        },
      );
    }

    const columns = await prisma.column.findMany({
      where: {
        boardId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json({
      columns,
    });
  } catch (error) {
    console.error("GET columns error:", error);

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
      boardId: string;
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

    const { boardId } = await context.params;

    const board = await getOwnedBoard(boardId, userId);

    if (!board) {
      return NextResponse.json(
        {
          message: "Board not found",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        {
          message: "Column name required",
        },
        {
          status: 400,
        },
      );
    }

    const lastColumn = await prisma.column.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const column = await prisma.column.create({
      data: {
        name,
        boardId,
        position: lastColumn ? lastColumn.position + 1 : 0,
      },
    });

    return NextResponse.json(
      {
        column,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST columns error:", error);

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
