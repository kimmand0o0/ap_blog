import { Comment, User } from "@prisma/client";

import { CommentRepository } from "@/repositories";

export interface ICommentUseCase {
  createComment(
    postId: string,
    content: string,
    authorId: string
  ): Promise<
    | (Comment & {
        author: User;
      })
    | null
  >;
  updateComment(
    id: string,
    authorId: string,
    content: string,
    role?: "USER" | "ADMIN"
  ): Promise<Comment | null>;
  deleteComment(
    id: string,
    authorId: string,
    role?: "USER" | "ADMIN"
  ): Promise<void>;
}

export class CommentUseCase implements ICommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(
    postId: string,
    content: string,
    authorId: string
  ): Promise<
    | (Comment & {
        author: User;
      })
    | null
  > {
    const comment = await this.commentRepository.createComment(
      content,
      authorId,
      postId
    );

    return this.commentRepository.findById(comment.id);
  }

  async updateComment(
    id: string,
    authorId: string,
    content: string,
    role = "USER"
  ): Promise<Comment | null> {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (role === "USER" && comment.authorId !== authorId) {
      throw new Error("게시글 작성자만 수정할 수 있습니다.");
    }

    return this.commentRepository.updateComment(id, content);
  }

  async deleteComment(
    id: string,
    authorId: string,
    role = "USER"
  ): Promise<void> {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (role === "USER" && comment.authorId !== authorId) {
      throw new Error("게시글 작성자만 수정할 수 있습니다.");
    }

    await this.commentRepository.deleteComment(id);
  }

  async findManyByPostId(
    postId: string,
    page: string,
    size = 5
  ): Promise<{
    count: number;
    comments: (Comment & { author: User })[];
  } | null> {
    const numPage = Number(page);

    const start = (numPage - 1) * size;

    const count = await this.commentRepository.count(postId);
    const comments = await this.commentRepository.findManyByPostId(
      postId,
      start,
      size
    );

    return {
      count,
      comments,
    };
  }
}
