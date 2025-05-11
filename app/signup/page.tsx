"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SignupRequestDto, SignupResponseDto } from "@/app/api/dtos/signup.dto";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import SignupInput from "@/app/signup/_components/input";

import useStore from "@/hooks/use-store";

export default function Signup() {
  const router = useRouter();

  const { duplicateInputs, getSignupVerification, setUser } = useStore();
  const values = useStore((state) => state.values);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const [isVerified, setIsVerified] = useState(false);

  const handleSignup = async () => {
    const data = values!.reduce(
      (
        acc: Record<string, string>,
        input: { label: string; value: string }
      ) => {
        acc[input.label] = input.value;
        return acc;
      },
      {}
    );

    const { email, username, password } = data;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password } as SignupRequestDto),
    });

    if (response.status === 201) {
      const { user } = await response.json();
      const { email, username, role }: SignupResponseDto = user;

      setUser(email, username, role);

      alert("회원가입이 완료되었습니다.");

      router.push("/");
    }
  };

  useEffect(() => {
    setIsVerified(getSignupVerification());
  }, [values]);

  if (isLoggedIn) {
    router.push("/");
    return null;
  }

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
            {duplicateInputs.map(
              ({
                label,
                type,
                placeholder,
                validCondition,
                inValidMessage,
                duplicateMessage,
                handleDuplicateCheck,
              }) => (
                <SignupInput
                  key={label}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  validCondition={validCondition}
                  inValidMessage={inValidMessage}
                  duplicateMessage={duplicateMessage ?? ""}
                  handleDuplicateCheck={handleDuplicateCheck ?? undefined}
                />
              )
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/login")}>
            취소하기
          </Button>
          <Button disabled={!isVerified} onClick={handleSignup}>
            회원 가입 하기
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
