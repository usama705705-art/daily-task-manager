import { create } from "zustand";
import type { User } from "firebase/auth";

import { subscribeToAuthState } from "@/lib/auth-state";

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => {
    set({
      user,
      loading: false,
      initialized: true,
    });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  initialize: () => {
    set({ loading: true });

    const unsubscribe = subscribeToAuthState((user) => {
      set({
        user,
        loading: false,
        initialized: true,
      });
    });

    return unsubscribe;
  },
}));
