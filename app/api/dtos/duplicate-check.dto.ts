export interface EmailDuplicateCheckRequestDto {
  email: string;
}

export interface EmailDuplicateCheckResponseDto {
  message?: string;
  error?: string;
}

export interface UserNameDuplicateCheckRequestDto {
  username: string;
}

export interface UserNameDuplicateCheckResponseDto {
  message?: string;
  error?: string;
}
