import { UserRepository } from "@/repositories/user-repository";
import { hashPassword } from "@/utils/hash-password";

import { User } from "@prisma/client";

export interface ISignupUseCase {
  duplicateCheckEmail(email: string): Promise<User | null>;
  duplicateCheckUsername(username: string): Promise<User | null>;
  execute(email: string, username: string, password: string): Promise<User>;
}

export class SignupUseCase implements ISignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async duplicateCheckEmail(email: string): Promise<User | null> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser;
  }

  async duplicateCheckUsername(username: string): Promise<User | null> {
    const existingUser = await this.userRepository.findByUserName(username);
    return existingUser;
  }

  async execute(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const existingUsername = await this.userRepository.findByUserName(username);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = hashPassword(password);

    const newUser = await this.userRepository.createUser(
      email,
      username,
      hashedPassword
    );

    return newUser;
  }
}
