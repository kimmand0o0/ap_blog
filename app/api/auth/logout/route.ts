import { NextResponse } from "next/server";

export async function PATCH() {
  const response = NextResponse.json(
    { success: true, message: "로그아웃되었습니다." },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
