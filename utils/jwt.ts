import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;

// 토큰 생성 함수
export function generateJWT(payload: object, expires?: number): string {
  const expiresIn = expires || "7d";
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// 토큰 검증 함수
export function verifyJWT<T>(token: string): T {
  return jwt.verify(token, SECRET_KEY) as T;
}
