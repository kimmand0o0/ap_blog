import { TUserRole } from "@/slices/create-user-slice";

export interface SignupRequestDto {
  email: string;
  username: string;
  password: string;
}

export interface SignupResponseDto {
  email: string;
  username: string;
  role: TUserRole;
}
