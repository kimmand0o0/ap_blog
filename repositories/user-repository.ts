import { PrismaClient, User } from "@prisma/client";

interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUserName(username: string): Promise<User | null>;
  userExists(email: string, username: string): Promise<User | null>;
  createUser(email: string, username: string, password: string): Promise<User>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async findByUserName(username: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });

      return user;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async userExists(email: string, username: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
  }

  async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password,
        },
      });
      return user;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
