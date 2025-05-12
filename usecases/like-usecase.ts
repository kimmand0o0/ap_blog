import { Like } from "@prisma/client";

import { LikeRepository } from "@/repositories";

export interface ILikeUseCase {
  getLikeByPostId(postId: string, userId: string): Promise<Like | null>;
  createLike(postId: string, userId: string): Promise<Like | null>;
  deleteLike(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
  ): Promise<Like | null>;
}

export class LikeUseCase implements ILikeUseCase {
  constructor(private likeRepository: LikeRepository) {}

  async getLikeByPostId(postId: string, userId: string): Promise<Like | null> {
    return this.likeRepository.getLikeByPostId(postId, userId);
  }

  async createLike(postId: string, userId: string): Promise<Like | null> {
    return this.likeRepository.createLike(postId, userId);
  }

  async deleteLike(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
  ): Promise<Like | null> {
    const like = await this.likeRepository.getLikeById(id);

    if (!like) {
      throw new Error("좋아요를 찾을 수 없습니다.");
    }

    if (role === "USER" && like.userId !== userId) {
      throw new Error("좋아요 작성자만 삭제할 수 있습니다.");
    }

    return this.likeRepository.deleteLike(id);
  }
}
