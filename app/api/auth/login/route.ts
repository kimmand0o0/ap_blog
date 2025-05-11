import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { UserRepository } from "@/repositories/user-repository";

import { TUserRole } from "@/slices/create-user-slice";
import { AuthUseCase } from "@/usecases/auth-usecase";
import { generateJWT } from "@/utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "충분한 정보를 전달받지 못했습니다." },
        { status: 400 }
      );
    }

    const userRepository = new UserRepository(new PrismaClient());
    const authUseCase = new AuthUseCase(userRepository);

    const user = await authUseCase.login(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "로그인에 실패하였습니다." },
        { status: 400 }
      );
    }

    const token = generateJWT({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const responseBody = {
      email: user.email,
      username: user.username,
      role: user.role as TUserRole,
    };

    const response = new NextResponse(
      JSON.stringify({
        user: responseBody,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
