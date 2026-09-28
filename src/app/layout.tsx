import type { Metadata } from "next";

import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Daily Task Manager",
  description:
    "Professional task management and progress tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
