import { formatDate } from "@/utils/format-date";

import Comments from "@/app/post/[id]/_components/comments";
import PostButtons from "@/app/post/[id]/_components/post-buttons";
import Like from "@/app/post/[id]/_components/like";

const url = process.env.URL;

interface PostDetailProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetail({ params }: PostDetailProps) {
  const id = (await params).id;

  const response = await fetch(`${url}/api/post/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const post = await response.json();

  return (
    <main className="flex flex-col p-4 gap-4">
      <PostButtons id={id} authorName={post.author.username} />
      <div className="p-1 text-3xl">{post.title}</div>
      <div className="border-b-[1px] flex justify-between px-3">
        <div>{post.author.username}</div>
        <div className="text-zinc-500 text-sm">
          {formatDate(post.createdAt)}
        </div>
      </div>
      <div
        className="prose p-2 min-h-[300px]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Like postId={id} author={post.author} />
      <Comments postId={id} />
    </main>
  );
}
