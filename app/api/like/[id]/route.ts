import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { verifyJWT } from "@/utils/jwt";
import { LikeRepository } from "@/repositories";
import { LikeUseCase } from "@/usecases/like-usecase";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { role, id: userId } = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token);

    const prisma = new PrismaClient();
    const likeRepository = new LikeRepository(prisma);
    const likeUseCase = new LikeUseCase(likeRepository);

    await likeUseCase.deleteLike(id, userId, role);

    return NextResponse.json(
      { message: "좋아요가 성공적으로 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
