export interface CreatePostRequestDto {
  title: string;
  content: string;
  tags: string;
}

export interface PutPostRequestDto {
  id: string;
  title: string;
  content: string;
  tags: string;
}

export interface DeletePostRequestDto {
  id: string;
}
