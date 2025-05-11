import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import { UserRepository } from "@/repositories/user-repository";
import { SignupUseCase } from "@/usecases/signup-usecase";

import {
  UserNameDuplicateCheckRequestDto,
  UserNameDuplicateCheckResponseDto,
} from "@/app/api/dtos/duplicate-check.dto";

export async function POST(
  req: NextRequest
): Promise<NextResponse<UserNameDuplicateCheckResponseDto>> {
  try {
    const { username }: UserNameDuplicateCheckRequestDto = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "닉네임을 전달받지 못했습니다." },
        { status: 400 }
      );
    }

    const userRepository = new UserRepository(new PrismaClient());
    const signupUseCase = new SignupUseCase(userRepository);

    const user = await signupUseCase.duplicateCheckUsername(username);

    if (user) {
      return NextResponse.json(
        { error: "이미 존재하는 닉네임 입니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "사용 가능한 닉네임 입니다." },
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
