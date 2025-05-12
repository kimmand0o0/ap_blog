import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { verifyJWT } from "@/utils/jwt";
import { CommentRepository } from "@/repositories";
import { CommentUseCase } from "@/usecases/comment-usecase";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { content } = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { role, id: authorId } = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token);

    const prisma = new PrismaClient();
    const commentRepository = new CommentRepository(prisma);
    const commentUseCase = new CommentUseCase(commentRepository);

    const comment = await commentUseCase.updateComment(
      id,
      authorId,
      content,
      role
    );

    return NextResponse.json(
      { message: "댓글이 성공적으로 수정되었습니다.", comment },
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

    const { role, id: authorId } = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token);

    const prisma = new PrismaClient();
    const commentRepository = new CommentRepository(prisma);
    const commentUseCase = new CommentUseCase(commentRepository);

    await commentUseCase.deleteComment(id, authorId, role);

    return NextResponse.json(
      { message: "게시글이 성공적으로 삭제되었습니다." },
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
