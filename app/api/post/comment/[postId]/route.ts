import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { verifyJWT } from "@/utils/jwt";
import { CommentRepository } from "@/repositories";
import { CommentUseCase } from "@/usecases/comment-usecase";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const { content } = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const authorId = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token).id;

    const prisma = new PrismaClient();
    const commentRepository = new CommentRepository(prisma);
    const commentUseCase = new CommentUseCase(commentRepository);

    const comment = await commentUseCase.createComment(
      postId,
      content,
      authorId
    );

    return NextResponse.json(
      { message: "댓글이 성공적으로 생성되었습니다.", comment },
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

    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? "1";

    const prisma = new PrismaClient();
    const commentRepository = new CommentRepository(prisma);
    const commentUseCase = new CommentUseCase(commentRepository);

    const comments = await commentUseCase.findManyByPostId(postId, page);

    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
