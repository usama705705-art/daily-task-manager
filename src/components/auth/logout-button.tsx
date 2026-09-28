"use client";

import { useRouter } from "next/navigation";

import { logoutUser } from "@/lib/auth";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUser();
      router.replace("/login");
    } catch {
      // Firebase logout errors are intentionally not exposed to the user.
    }
  }

  return (
    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
    >
      Sign out
    </button>
  );
}
