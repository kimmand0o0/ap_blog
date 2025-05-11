"use client";

import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import useStore from "@/hooks/use-store";

interface PostButtonsProps {
  id: string;
  authorName: string;
}

export default function PostButtons({ id, authorName }: PostButtonsProps) {
  const router = useRouter();

  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const username = useStore((state) => state.username);
  const role = useStore((state) => state.role);

  const handleDeletePost = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const result = confirm("게시글이 삭제됩니다. 정말 삭제 하시겠어요?");
    if (!result) return event.preventDefault();

    const response = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      alert("삭제에 실패했습니다. 잠시 후 다시 시도해주세요!");
    }

    router.push("/");
  };

  if (role === "USER" && (!isLoggedIn || username !== authorName)) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => router.push(`/post/edit/${id}`)}>
        수정
      </Button>
      <Button
        variant="destructive"
        onClick={(event) => handleDeletePost(event)}
      >
        삭제
      </Button>
    </div>
  );
}
