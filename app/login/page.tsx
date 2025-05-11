"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import useStore from "@/hooks/use-store";

import { LoginRequestDto, LoginResponseDto } from "@/app/api/dtos/login.dto";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const router = useRouter();

  const { setUser } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password } as LoginRequestDto),
    });

    if (!response.ok) {
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      return;
    }
    const { user }: { user: LoginResponseDto } = await response.json();

    setUser(user.email, user.username, user.role);
    alert("로그인에 성공했습니다.");

    router.push("/");
  };

  return (
    <main className="w-screen h-screen p-48 flex items-center justify-center">
      <Card className="min-w-[350px]">
        <CardHeader>
          <CardTitle className="text-xl">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Name of your project"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/signup")}>
            회원 가입
          </Button>
          <Button onClick={handleLogin}>로그인</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
