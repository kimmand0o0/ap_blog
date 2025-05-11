"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Comment from "@/app/post/[id]/_components/comment";

export default function Comments() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const handleCreateComment = () => {
    setComments((prev) => [...prev, comment]);
    setComment("")
  };

  return (
    <div className="border-t-[1px] flex flex-col gap-2 p-2">
      <p className="font-semibold">comments</p>
      <div className="flex flex-row gap-2 items-center">
        <Input value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button onClick={handleCreateComment}>댓글 작성</Button>
      </div>
      {comments.map((comment) => <Comment initialComment={comment} />)}
    </div>
  );
}
