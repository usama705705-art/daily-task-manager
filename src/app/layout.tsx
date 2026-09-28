import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Task Manager",
  description: "Professional task management and progress tracking system",
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
