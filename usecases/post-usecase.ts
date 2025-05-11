import { Post } from "@prisma/client";

import { PostRepository } from "@/repositories/post-repository";

export interface IPostUseCase {
  createPost(
    title: string,
    content: string,
    tags: string,
    authorId: string
  ): Promise<Post | null>;
  updatePost(
    id: string,
    title: string,
    tags: string,
    authorId: string,
    content: string
  ): Promise<Post | null>;
  deletePost(id: string, authorId: string): Promise<void>;
  findById(id: string): Promise<Post | null>;
  findAll(
    page: string,
    orderBy : "createdAt" | "updatedAt",
    size?: number
  ): Promise<{ count: number; posts: Post[] } | null>;
}

export class PostUseCase implements IPostUseCase {
  constructor(private postRepository: PostRepository) {}

  async createPost(
    title: string,
    content: string,
    tags: string,
    authorId: string
  ): Promise<Post | null> {
    return this.postRepository.createPost(title, content, tags, authorId);
  }

  async updatePost(
    id: string,
    title: string,
    authorId: string,
    tags: string,
    content: string
  ): Promise<Post | null> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (post.authorId !== authorId) {
      throw new Error("게시글 작성자만 수정할 수 있습니다.");
    }

    return this.postRepository.updatePost(id, title, tags, content);
  }

  async deletePost(id: string, authorId: string): Promise<void> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (post.authorId !== authorId) {
      throw new Error("게시글 작성자만 수정할 수 있습니다.");
    }

    await this.postRepository.deletePost(id);
  }

  async findById(id: string): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  async findAll(
    page: string,
    orderBy : string,
    size = 5
  ): Promise<{ count: number; posts: Post[] } | null> {
    const numPage = Number(page);

    const start = (numPage - 1) * size;

    const count = await this.postRepository.count();
    const posts = await this.postRepository.findAll(start, size, orderBy);

    return {
      count,
      posts,
    };
  }
}
