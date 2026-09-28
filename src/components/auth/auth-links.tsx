"use client";

import Link from "next/link";

type AuthLinksProps = {
  mode: "login" | "register";
};

export default function AuthLinks({
  mode,
}: AuthLinksProps) {
  if (mode === "login") {
    return (
      <p className="auth-links">
        Don't have an account?{" "}
        <Link href="/register">Create account</Link>
      </p>
    );
  }

  return (
    <p className="auth-links">
      Already have an account?{" "}
      <Link href="/login">Sign in</Link>
    </p>
  );
}
