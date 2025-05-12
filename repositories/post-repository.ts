import { PrismaClient, Post, User } from "@prisma/client";

interface IPostRepository {
  count(search: string): Promise<number>;
  findAll(
    start: number,
    size: number,
    orderBy: "createdAt" | "updatedAt",
    search: string
  ): Promise<(Post & { author: User })[]>;
  findById(id: string): Promise<(Post & { author: User }) | null>;
  createPost(
    title: string,
    content: string,
    tags: string,
    authorId: string
  ): Promise<Post>;
  updatePost(
    id: string,
    title: string,
    tags: string,
    content: string
  ): Promise<Post>;
  deletePost(id: string): Promise<Post>;
  findById(id: string): Promise<(Post & { author: User }) | null>;
  createPost(
    title: string,
    content: string,
    tags: string,
    authorId: string
  ): Promise<Post>;
  updatePost(
    id: string,
    title: string,
    tags: string,
    content: string
  ): Promise<Post>;
  deletePost(id: string): Promise<Post>;
}

export class PostRepository implements IPostRepository {
  constructor(private prisma: PrismaClient) {}

  async count(search: string): Promise<number> {
    try {
      const count = await this.prisma.post.count({
        where: {
          title: {
            contains: `%${search}%`,
            mode: "insensitive",
          },
        },
      });
      return count;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findAll(
    start: number,
    size: number,
    orderBy: string,
    search: string
  ): Promise<(Post & { author: User })[]> {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          title: {
            contains: `%${search}%`,
            mode: "insensitive",
          },
        },
        include: {
          author: true,
        },
        skip: start,
        take: size,
        orderBy: {
          [orderBy]: "desc",
        },
      });
      return posts;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findById(id: string): Promise<(Post & { author: User }) | null> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
        },
      });

      return post;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async createPost(
    title: string,
    content: string,
    tags: string,
    authorId: string
  ): Promise<Post> {
    try {
      const post = await this.prisma.post.create({
        data: {
          title,
          content,
          tags,
          authorId,
        },
      });

      return post;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async updatePost(
    id: string,
    title: string,
    tags: string,
    content: string
  ): Promise<Post> {
    try {
      const post = await this.prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          tags,
        },
      });
      return post;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async deletePost(id: string): Promise<Post> {
    try {
      const post = await this.prisma.post.delete({
        where: {
          id,
        },
      });
      return post;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
