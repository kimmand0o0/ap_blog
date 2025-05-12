import type { Metadata } from "next";

import "./globals.css";

import Header from "@/components/header";

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
      <body>
        <Header />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
