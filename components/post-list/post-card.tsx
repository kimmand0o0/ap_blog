import Link from "next/link";

import { Post, User } from "@prisma/client";

import { formatDate } from "@/utils/format-date";
import { Badge } from "../ui/badge";

interface PostCardProps {
  post: Post & { author: User };
}

const url = process.env.URL;

export default function PostCard({ post }: PostCardProps) {
  const tags = post.tags ?? "";
  const tagList = tags.length > 0 ? tags.split(",") : [];

  console.log(tags);
  return (
    <Link
      className="w-full p-4 rounded-xl shadow-40 shadow-zinc-300"
      href={`${url}/post/${post.id}`}
    >
      <div className="flex flex-row justify-between">
        <div className="text-lg">{post.title}</div>
        <div>{post.author.username}</div>
      </div>
      <div
        className="prose p-2 text-zinc-500 text-sm truncate2lines"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="w-full flex justify-end gap-2 overflow-auto">
        {tagList.map((tag, index) => (
          <Badge key={`tag-${tag}${index}`} variant="outline">
            {tag}
          </Badge>
        ))}
        <div className="text-sm text-zinc-400">
          {formatDate(post.createdAt)}
        </div>
      </div>
    </Link>
  );
}
