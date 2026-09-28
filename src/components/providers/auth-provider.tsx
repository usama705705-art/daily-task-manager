"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();

    return () => {
      unsubscribe();
    };
  }, [initialize]);

  return <>{children}</>;
}
