"use client";

import { useEffect, useState } from "react";
import { Comment as TComment, User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Comment from "@/app/post/[id]/_components/comment";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import useStore from "@/hooks/use-store";

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<(TComment & { author: User })[]>([]);

  const maxPage = Math.ceil(count / 5);

  const pageNumbers: number[] = Array.from(
    { length: maxPage },
    (_, i) => i + 1
  );

  const handleCreateComment = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    const response = await fetch(`/api/post/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: comment,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const newComment = await response.json();

    setComments((prev) => [newComment.comment, ...prev]);
    setComment("");
    setPage(1);
  };

  const getComment = async () => {
    const response = await fetch(`/api/post/comment/${postId}?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const { count, comments } = await response.json();

    setCount(count);
    setComments(comments);
  };

  const handleDeleteComment = async (id: string) => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    const response = await fetch(`/api/comment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    getComment();
  };

  useEffect(() => {
    getComment();
  }, [page]);

  return (
    <div className="border-t-[1px] flex flex-col gap-2 p-2">
      <p className="font-semibold">comments</p>
      <div className="flex flex-row gap-2 items-center">
        <Input value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button onClick={handleCreateComment}>댓글 작성</Button>
      </div>
      {comments.map((comment) => (
        <Comment
          key={`comment-${comment.id}`}
          initialComment={comment}
          handleDeleteComment={handleDeleteComment}
        />
      ))}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => (page > 1 ? page - 1 : 1)} />
          </PaginationItem>
          {pageNumbers.map((page) => (
            <PaginationItem key={`pagination-${page}`}>
              <button onClick={() => setPage(page)}>{page}</button>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => (page < maxPage ? page + 1 : maxPage)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
