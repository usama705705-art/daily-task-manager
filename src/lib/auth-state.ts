import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "./firebase";

export function subscribeToAuthState(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
