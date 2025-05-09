"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import DuplicateCheckInput from "@/app/signup/_components/duplicate-check-input";

export default function Signup() {
  const router = useRouter();

  const DUPLICATE_INPUTS: {
    label: string;
    type: string;
    placeholder: string;
    validCondition: (value: string) => boolean;
    inValidMessage: string;
    duplicateMessage: string;
  }[] = [
    {
      label: "email",
      type: "email",
      placeholder: "Email",
      validCondition: (email: string): boolean => {
        const trimmed = email.trim();

        return (
          trimmed.includes("@") &&
          !trimmed.includes("..") &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
        );
      },
      inValidMessage: "이메일 형식이 아닙니다.",
      duplicateMessage: "중복된 이메일 입니다.",
    },
    {
      label: "name",
      type: "string",
      placeholder: "Nick Name",
      validCondition: (name: string): boolean => {
        const trimmed = name.trim();

        return (
          trimmed.length >= 2 &&
          trimmed.length <= 10 &&
          /^[a-zA-Z0-9가-힣]+$/.test(trimmed)
        );
      },
      inValidMessage: "닉네임은 2자 이상 10자 이하로 입력해주세요.",
      duplicateMessage: "중복된 닉네임 입니다.",
    },
  ];

  return (
    <main className="w-screen h-screen p-48 flex items-center justify-center">
      <Card className="min-w-[350px]">
        <CardHeader>
          <CardTitle className="text-xl">회원 가입</CardTitle>
          <CardDescription>
            회원 가입을 위해 아래의 정보를 입력해주세요. 가입 후에는 이메일과
            비밀번호로 로그인 할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {DUPLICATE_INPUTS.map(
              ({
                label,
                type,
                placeholder,
                validCondition,
                inValidMessage,
                duplicateMessage,
              }) => (
                <DuplicateCheckInput
                  key={label}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  validCondition={validCondition}
                  inValidMessage={inValidMessage}
                  duplicateMessage={duplicateMessage}
                />
              )
            )}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/login")}>
            취소하기
          </Button>
          <Button>회원 가입 하기</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
