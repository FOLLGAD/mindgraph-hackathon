"use client";
import { SkillTreeProvider } from "@/app/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SkillTreeProvider>{children}</SkillTreeProvider>;
}
