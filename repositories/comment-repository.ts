import { PrismaClient, Comment, User } from "@prisma/client";

interface ICommentRepository {
  count(postId: string): Promise<number>;
  findManyByPostId(
    postId: string,
    start: number,
    size: number
  ): Promise<(Comment & { author: User })[]>;
  findById(id: string): Promise<(Comment & { author: User }) | null>;
  createComment(
    content: string,
    authorId: string,
    postId: string
  ): Promise<Comment>;
  updateComment(id: string, content: string): Promise<Comment>;
  deleteComment(id: string): Promise<Comment>;
}

export class CommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaClient) {}

  async count(postId: string): Promise<number> {
    try {
      const count = await this.prisma.comment.count({
        where: {
          postId,
        },
      });
      return count;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findManyByPostId(
    postId: string,
    start: number,
    size: number
  ): Promise<(Comment & { author: User })[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
      skip: start,
      take: size,
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  }

  async findById(id: string): Promise<(Comment & { author: User }) | null> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });

      return comment;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async createComment(
    content: string,
    authorId: string,
    postId: string
  ): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          content,
          authorId,
          postId,
        },
      });

      return comment;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.update({
        where: {
          id,
        },
        data: {
          content,
        },
      });
      return comment;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async deleteComment(id: string): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.delete({
        where: {
          id,
        },
      });
      return comment;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
