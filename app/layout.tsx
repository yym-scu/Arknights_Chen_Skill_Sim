import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赤刃明霄陈 战术模拟终端",
  description: "Arknights Chen Simulator Refactored",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-game-bg">
        {children}
      </body>
    </html>
  );
}
