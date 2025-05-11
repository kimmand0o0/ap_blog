import { Post, User } from "@prisma/client";

import PostCard from "@/components/post-list/post-card";
import PostOrder from "@/components/post-list/post-order";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PostListProps {
  count: number;
  initialPosts: (Post & { author: User })[];
  page: number;
}

export default function PostList({ count, initialPosts, page }: PostListProps) {
  const maxPage = Math.ceil(count / 5);

  const pageNumbers: number[] = Array.from(
    { length: maxPage },
    (_, i) => i + 1
  );

  return (
    <>
    <PostOrder />
      <div className="w-full flex flex-col gap-2">
        {initialPosts.map((post: Post & { author: User }) => (
          <PostCard key={post.id} post={post} />
        ))}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
            </PaginationItem>
            {pageNumbers.map((page) => (
              <PaginationItem key={`pagination-${page}`}>
                <PaginationLink href={`?page=${page}`}>{page}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${page < maxPage ? page + 1 : maxPage}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
