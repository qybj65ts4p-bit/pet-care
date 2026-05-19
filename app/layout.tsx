import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "孩子习惯养成积分系统",
  description: "卡通可爱风孩子习惯积分打卡系统",
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
