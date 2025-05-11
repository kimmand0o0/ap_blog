import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { PostUseCase } from "@/usecases/post-usecase";
import { PostRepository } from "@/repositories/post-repository";

import { verifyJWT } from "@/utils/jwt";

import { PutPostRequestDto } from "@/app/api/dtos/post.dto";

export async function PUT(req: NextRequest) {
  try {
    const { id, title, tags, content }: PutPostRequestDto = await req.json();

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
    const postRepository = new PostRepository(prisma);
    const postUseCase = new PostUseCase(postRepository);

    const post = await postUseCase.updatePost(
      id,
      title,
      authorId,
      tags,
      content
    );

    return NextResponse.json(
      { message: "게시글이 성공적으로 수정되었습니다.", post },
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

    const authorId = verifyJWT<{
      id: string;
      email: string;
      username: string;
      role: "USER" | "ADMIN";
    }>(token).id;

    const prisma = new PrismaClient();
    const postRepository = new PostRepository(prisma);
    const postUseCase = new PostUseCase(postRepository);

    await postUseCase.deletePost(id, authorId);

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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const prisma = new PrismaClient();
    const postRepository = new PostRepository(prisma);
    const postUseCase = new PostUseCase(postRepository);

    const post = await postUseCase.findById(id);

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
