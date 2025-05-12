import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { verifyJWT } from "@/utils/jwt";
import { LikeRepository } from "@/repositories";
import { LikeUseCase } from "@/usecases/like-usecase";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token).id;

    const prisma = new PrismaClient();
    const likeRepository = new LikeRepository(prisma);
    const likeUseCase = new LikeUseCase(likeRepository);

    const like = await likeUseCase.createLike(postId, userId);

    return NextResponse.json(
      { message: "댓글이 성공적으로 생성되었습니다.", like },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token).id;

    const prisma = new PrismaClient();
    const likeRepository = new LikeRepository(prisma);
    const likeUseCase = new LikeUseCase(likeRepository);

    const like = await likeUseCase.getLikeByPostId(postId, userId);

    return NextResponse.json(like, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
