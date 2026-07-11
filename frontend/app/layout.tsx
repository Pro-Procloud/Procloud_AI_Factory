import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Procloud AI Factory Prototype",
  description: "Clickable product and architecture prototype for the AI Factory Bugfix workflow"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
