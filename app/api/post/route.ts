import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { PostUseCase } from "@/usecases/post-usecase";
import { PostRepository } from "@/repositories/post-repository";

import { verifyJWT } from "@/utils/jwt";

import { CreatePostRequestDto } from "@/app/api/dtos/post.dto";

export async function POST(req: NextRequest) {
  try {
    const { title, content, tags }: CreatePostRequestDto = await req.json();

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

    const post = await postUseCase.createPost(title, content, tags, authorId);

    return NextResponse.json(
      { message: "게시글이 성공적으로 생성되었습니다.", post },
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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") ?? "";
    const page = url.searchParams.get("page") ?? "1";
    const orderBy = url.searchParams.get("orderBy") ?? "createdAt";

    const prisma = new PrismaClient();
    const postRepository = new PostRepository(prisma);
    const postUseCase = new PostUseCase(postRepository);

    const posts = await postUseCase.findAll(page, orderBy, search);

    return NextResponse.json(posts, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
