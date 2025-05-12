"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Post } from "@prisma/client";

import useStore from "@/hooks/use-store";

import PostForm from "@/components/post-form";

export default function NewPost() {
  const router = useRouter();
  const params = useParams();

  const postId = params.id as string;

  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const handlePostUpdate = async (
    title: string,
    content: string,
    tags: string[]
  ) => {
    const newTags = tags.length > 0 ? tags.join(", ") : null;

    const response = await fetch(`/api/post/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: postId,
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

  useEffect(() => {
    if (!isLoggedIn) {
      if (typeof window !== "undefined") {
        alert("로그인이 필요한 서비스 입니다.");
      }
      router.push("/login");
    }

    const getPost = async (id: string) => {
      const response = await fetch(`/api/post/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return;
      }
      const data = await response.json();

      setPost(data);
      setIsLoading(true);
    };

    getPost(postId);
  }, []);

  return (
    <>
      {isLoading && (
        <PostForm
          initialTitle={post!.title}
          initialContent={post!.content}
          initialTags={post!.tags === null ? [] : post!.tags.split(", ")}
          onSubmit={handlePostUpdate}
        />
      )}
    </>
  );
}
