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

    const column = await prisma.column.findFirst({
      where: {
        id,
        board: {
          userId,
        },
      },
    });

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

    await prisma.column.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Column deleted",
    });
  } catch (error) {
    console.error("DELETE column error:", error);

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
