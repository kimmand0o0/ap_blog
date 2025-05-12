"use client";

import { Comment as TComment, User } from "@prisma/client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/hooks/use-store";
import { formatDate } from "@/utils/format-date";

interface CommentProps {
  initialComment: TComment & { author: User };
  handleDeleteComment: (id: string) => void;
}

export default function Comment({
  initialComment,
  handleDeleteComment,
}: CommentProps) {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const username = useStore((state) => state.username);

  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(initialComment.content);

  const isAuthor = username === initialComment.author.username;

  // const handleCreateReComment = async () => {
  //   setIsOpen(false);
  // };

  const handleUpdateComment = async () => {
    if (!isEdit) {
      setIsEdit(true);
      return;
    }

    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    const response = await fetch(`/api/comment/${initialComment.id}`, {
      method: "PUT",
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

    const updatedComment = await response.json();

    setComment(updatedComment.comment.content);
    setIsEdit(false);
  };

  return (
    <div className="border-[1px] py-2 px-4 rounded-md flex flex-col justify-between items-end gap-2">
      <div className="w-full flex flex-row gap-2 items-center">
        <div className="flex-1 font-semibold">
          {initialComment.author.username}
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-fit text-xs px-2 py-1"
              onClick={handleUpdateComment}
            >
              {isEdit ? "완료" : "수정"}
            </Button>
            <Button
              variant="destructive"
              className="h-fit text-xs px-2 py-1"
              onClick={async () => handleDeleteComment(initialComment.id)}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      {isEdit && (
        <Input value={comment} onChange={(e) => setComment(e.target.value)} />
      )}
      {!isEdit && <div className="flex-1 w-full">{comment}</div>}
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex-1 text-zinc-500 text-sm">
          {formatDate(initialComment.createdAt)}
        </div>
      </div>
    </div>
  );
}
