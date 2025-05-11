import { TUserRole } from "@/slices/create-user-slice";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  email: string;
  username: string;
  role: TUserRole;
}
