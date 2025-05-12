"use client";

import { useRouter } from "next/navigation";

import useStore from "@/hooks/use-store";

import PostForm from "@/components/post-form";

export default function NewPost() {
  const router = useRouter();
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    if (typeof window !== "undefined") {
      alert("로그인이 필요한 서비스 입니다.");
    }
    router.push("/login");
  }

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
