import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "./firebase";

export async function registerUser(
  email: string,
  password: string,
  fullName: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(credential.user, {
    displayName: fullName,
  });

  return credential.user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
