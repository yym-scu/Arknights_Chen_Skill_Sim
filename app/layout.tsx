import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "赤刃明霄陈 战术模拟终端",
  description: "明日方舟赤刃明霄陈技能模拟器",
  appleWebApp: {
    capable: true,
    title: "赤刃模拟",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#121212",
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
