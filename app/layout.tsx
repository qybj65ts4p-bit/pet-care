import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "绒爪洗护 Pet Spa",
  description: "武汉高端宠物洗护店单页展示网站。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
