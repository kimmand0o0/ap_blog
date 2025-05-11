import { UserRepository } from "@/repositories/user-repository";
import { comparePassword } from "@/utils/hash-password";

import { User } from "@prisma/client";

export interface IAuthUseCase {
  login: (email: string, password: string) => Promise<User | null>;
}

export class AuthUseCase implements IAuthUseCase {
  constructor(private userRepository: UserRepository) {}

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isCompare = comparePassword(password, user?.password);

    if (!isCompare) {
      return null;
    }

    return user;
  }
}
