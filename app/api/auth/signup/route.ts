import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { UserRepository } from "@/repositories/user-repository";
import { SignupUseCase } from "@/usecases/signup-usecase";

import jwt from "jsonwebtoken";

import { SignupRequestDto, SignupResponseDto } from "@/app/api/dtos/signup.dto";
import { TUserRole } from "@/slices/create-user-slice";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { email, username, password }: SignupRequestDto = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "충분한 정보를 전달받지 못했습니다." },
        { status: 400 }
      );
    }

    const userRepository = new UserRepository(new PrismaClient());
    const signupUseCase = new SignupUseCase(userRepository);

    const userExists = await userRepository.userExists(email, username);

    if (userExists) {
      return NextResponse.json(
        { error: "이미 존재하는 유저 입니다." },
        { status: 400 }
      );
    }

    const user = await signupUseCase.execute(email, username, password);

    if (!user) {
      return NextResponse.json(
        { error: "회원가입에 실패하였습니다." },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    const responseBody: SignupResponseDto = {
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
