import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "AP blog app",
  description: "에이피링크 블로그 앱 입니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
