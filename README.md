# 📝 블로그 애플리케이션

Next.js, TailwindCSS, Supabase, Prisma, Vercel을 기반으로 구현한 블로그 애플리케이션입니다.  
사용자는 회원가입 및 로그인 후 글을 작성하고, 수정·삭제하거나 다른 사용자의 글을 볼 수 있습니다.

## 🚀 데모

[👉 배포된 사이트 보기](https://ap-blog-phi.vercel.app/)

![ap-blog](https://github.com/user-attachments/assets/2c487741-1b10-4644-b841-874e3d44b487)

## 📌 주요 기능

- 회원가입 및 로그인 (JWT 기반)
- 게시글 작성, 수정, 삭제 (본인만 가능)
- 게시글 목록 및 상세 보기 (비로그인도 가능)
- 댓글 기능
- 좋아요 기능 (본인 글 제외)
- 관리자 권한 기능 (모든 글 수정/삭제 가능)
- 정렬 기능 (작성일/수정일 기준)

- ## 🎉 프로젝트는 다음과 같은 순서로 진행하였습니다.

1. 프로젝트를 들어가기에 앞서 노션 확인
2. Issue로 작업해야 할 범위를 정리
   - [Next.js 프로젝트 기본 설정 #1](https://github.com/kimmand0o0/ap_blog/issues/1)
   - [Supabase - 데이터 베이스 생성 및 구현 #2](https://github.com/kimmand0o0/ap_blog/issues/2)
   - [회원가입 및 로그인 기능 구현 #3](https://github.com/kimmand0o0/ap_blog/issues/3)
   - [글 작성, 글 수정 기능 및 페이지 구현 #4](https://github.com/kimmand0o0/ap_blog/issues/4)
   - [글 목록 보기, 글 상세 보기, 글 삭제 기능 구현 #5](https://github.com/kimmand0o0/ap_blog/issues/5)
   - [관리자 기능 #6](https://github.com/kimmand0o0/ap_blog/issues/6)
   - [댓글, 좋아요 #7](https://github.com/kimmand0o0/ap_blog/issues/7)
   - [플러스 - 헤더 #8](https://github.com/kimmand0o0/ap_blog/issues/8)
3. 각 이슈에 맞는 작업 커밋을 작은 단위로 나눠 이슈에 등록

## 🛠 기술 스택

| 분류        | 사용 기술                                      |
|------------|----------------------------------------------|
| 프레임워크  | [Next.js](https://nextjs.org/)               |
| 스타일링    | [TailwindCSS](https://tailwindcss.com/)     |
| DB       | [Supabase](https://supabase.com/)            |
| ORM         | [Prisma](https://www.prisma.io/) + PostgreSQL |
| 배포        | [Vercel](https://vercel.com/)                |
| 상태관리    | Zustand                          |

## ⚙️ 프로젝트 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase 키, JWT 시크릿, DB URL 등 설정

DATABASE_URL=[user_database_url]

# Direct connection to the database. Used for migrations
DIRECT_URL=[user_supabse_direct_url]

SECRET_KEY=[user_secret_key]

# 로컬 테스트 시
URL = "http://localhost:3000"

# 3. Prisma 스키마 반영
npx prisma generate
npx prisma migrate dev --name init

# 4. 개발 서버 실행
npm run dev
```


## 어드민 아이디

테스트를 위하여 생성 한 어드민 계정입니다.
모든 게시글과 댓글을 수정, 삭제할 수 있습니다.

```
id : super@ap-blog.co
password : 1234qwer
```

## 🧐 구현 과정에서 고려한 사항

### [Shadcn/ui](https://ui.shadcn.com/docs/installation/next)

추가적으로 사용할 라이브러리로 shad/cn을 채택하였습니다.
shad/cn은 디자인이 없는 프로젝트의 경우, 완성도 높은 형태를 제공하며, 해당 ui의 기본 기능을 내장하고 있습니다.
또, `classNames`등을 활용한 cn 유틸로 Tailwind-css를 사용할 수 있으며, Radix를 베이스로 하고있어 커스텀이 쉽습니다.

### [Prisma](https://www.prisma.io/)

클린 아키텍처를 이용해 풀스택 프로젝트를 진행하려 합니다.
DB의 역할을 supabase에게 위임하고, Prisma로 타입 안정성과 좀 더 쉬운 코드 작성을 하려합니다.

### 처음 작성한 ERD와 변경 된 데이터 구조

![image](https://github.com/user-attachments/assets/cdf41105-8b64-4848-8df3-89854df6c833)
![image](https://github.com/user-attachments/assets/1e83679e-7138-4cb8-bc7e-0896aef598f9)

1차 테이블 구조를 작성한 후 네번의 migration을 통해 데이터를 잡아갔습니다.
user에 role을 추가 하거나, tag를 name으로 고정시켜 제공하는 것에서 자유롭게 입력할 수 있도록 개선하는 등의 변경이 있었습니다.

### Header 추가

노션에는 기재되어 있지 않지만, mainpage로의 라우팅과 로그인, 로그아웃 버튼, 검색을 담당하는 header를 추가하였습니다.
유저가 더 쉽게 해당 기능들에 접근할 수 있게 되었습니다.

### Tiptap-editor 사용

'블로그'이기 때문에 게시글이 중요하다고 생각하였습니다.
이 글을 잘 기록하기 위해서는 에디터를 넣는 것이 중요한 기능일 것이라고 생각하고 에디터를 적용하였습니다.

### Gitmoji

커밋을 작은 단위로 나누려 노력했습니다
커밋을 구분하기 쉽게 하기 위하여 Prefix로 Gitmoji를 사용하였습니다. (+ 많은 과제를 확인하실 것 같아 눈이 조금 더 편하셨으면 했습니다.)
![image](https://github.com/user-attachments/assets/10d11c8c-8af4-416a-8238-3f8bca827333)


## 아쉬운점..

결국 대댓글과 유저 프로필 이미지의 기능을 추가하지 못했습니다.
생각보다 많은 양과, 에디터를 넣는 등의 욕심으로 추가 기능을 더 구현하지 못한게 아쉽습니다.
