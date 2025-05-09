"use client";

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
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

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
              <Input id="email" type="email" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Name of your project"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex justify-between">
          <Button variant="outline" onClick={() => router.push("/signup")}>
            회원 가입
          </Button>
          <Button>로그인</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
