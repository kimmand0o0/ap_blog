import Link from "next/link";

import PostList from "@/components/post-list";
import { Button } from "@/components/ui/button";

const url = process.env.URL;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    orderBy: "createdAt" | "updatedAt";
    search: string;
  }>;
}) {
  const page = (await searchParams).page ?? 1;
  const orderBy = (await searchParams).orderBy ?? "createdAt";
  const search = (await searchParams).search ?? "";

  console.table({ url, orderBy, search });

  const response = await fetch(
    `${url}/api/post?page=${page}&orderBy=${orderBy}&search=${search}`,
    {
      method: "GET",
    }
  );

  console.log("response ===> \n", response);

  const data = await response.json();

  console.log(data);

  const { count, posts } = data;

  return (
    <main className="w-screen h-screen p-4 lg:p-12 md:p-8 flex flex-col items-center justify-start">
      <div className="w-full">
        <Link href="/post/new">
          <Button>새글쓰기</Button>
        </Link>
      </div>
      <PostList count={count} initialPosts={posts ?? []} page={Number(page)} />
    </main>
  );
}
