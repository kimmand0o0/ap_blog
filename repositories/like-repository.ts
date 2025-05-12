import { PrismaClient, Like } from "@prisma/client";

interface ILikeRepository {
  getLikeById(id: string): Promise<Like | null>;
  getLikeByPostId(postId: string, userId: string): Promise<Like | null>;
  createLike(postId: string, userId: string): Promise<Like | null>;
  deleteLike(id: string): Promise<Like | null>;
}

export class LikeRepository implements ILikeRepository {
  constructor(private prisma: PrismaClient) {}

  async getLikeById(id: string): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: {
        id,
      },
    });
  }

  async getLikeByPostId(postId: string, userId: string): Promise<Like | null> {
    return this.prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
  }

  async createLike(postId: string, userId: string): Promise<Like | null> {
    return this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async deleteLike(id: string): Promise<Like | null> {
    return this.prisma.like.delete({
      where: {
        id,
      },
    });
  }
}
