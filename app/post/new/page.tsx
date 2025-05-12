"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import useStore from "@/hooks/use-store";
import PostForm from "@/components/post-form";

export default function NewPost() {
  const router = useRouter();
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, router]); // 의존성 추가

  const handlePostCreate = async (
    title: string,
    content: string,
    tags: string[]
  ) => {
    const newTags = tags.length > 0 ? tags.join(", ") : null;

    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        tags: newTags,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    router.push(`/post/${data.post.id}`);
  };

  return <PostForm onSubmit={handlePostCreate} />;
}
