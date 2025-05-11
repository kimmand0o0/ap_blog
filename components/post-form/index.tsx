"use client";

import { useEffect, useState } from "react";

import TipTapEditor from "@/components/post-form/editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
}

export default function PostForm({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
}: PostFormProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value;
      if (input && !tags.includes(input)) {
        setTags((prev) => [...prev, input]);
        e.currentTarget.value = "";
      }
    }
  };

  useEffect(() => {
    if (title && content) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [title, content]);

  return (
    <div className="w-full flex flex-col gap-4 lg:p-20 md:p-10 sm:p-4 p-2">
      <TipTapEditor title={title} setTitle={setTitle} setContent={setContent} />
      <Input
        placeholder="태그를 입력 후 엔터를 눌러주세요."
        onKeyDown={handleTagInput}
      />
      <div className="flex flex-row gap-2">
        {tags.map((tag, index) => (
          <Badge key={`${index}-${tag}`} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="w-full flex flex-row gap-2">
        <Button variant="outline" className="w-full">
          취소
        </Button>
        <Button className="w-full" disabled={isActive}>
          완료
        </Button>
      </div>
    </div>
  );
}
