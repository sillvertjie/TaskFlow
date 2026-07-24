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

    const board = await prisma.board.findFirst({
      where: {
        id,
        userId,
      },
    });

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

    return NextResponse.json({
      board,
    });
  } catch (error) {
    console.error("GET /api/boards/[id] error:", error);

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

    const board = await prisma.board.findFirst({
      where: {
        id,
        userId,
      },
    });

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

    await prisma.board.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Board deleted",
    });
  } catch (error) {
    console.error("DELETE /api/boards/[id] error:", error);

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
