"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentProps {
  initialComment: string;
}

export default function Comment({ initialComment }: CommentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [comment, setComment] = useState(initialComment);

  const handleCreateReComment = async () => {
    setIsOpen(false);
  };

  return (
    <div className="border-[1px] py-2 px-4 rounded-md flex flex-col justify-between items-end gap-2">
      <div className="w-full flex flex-row gap-2 items-center">
        <div className="flex-1 font-semibold">username</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-fit text-xs px-2 py-1"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "완료" : "수정"}
          </Button>
          <Button variant="destructive" className="h-fit text-xs px-2 py-1">
            삭제
          </Button>
        </div>
      </div>
      {isEdit && (
        <Input value={comment} onChange={(e) => setComment(e.target.value)} />
      )}
      {!isEdit && <div className="flex-1 w-full">{comment}</div>}
      {!isOpen && (
        <div className="w-full flex flex-row justify-between items-end">
          <div className="flex-1 text-zinc-500 text-sm">createdAt</div>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            댓글
          </Button>
        </div>
      )}
      {isOpen && (
        <div className="w-full flex felx-row gap-2 items-center">
          <Input />
          <Button onClick={handleCreateReComment}>작성</Button>
        </div>
      )}
    </div>
  );
}
