import { getFunctions, httpsCallable } from "firebase/functions";

import { auth } from "./firebase";

const functions = getFunctions(auth.app);

type CreateManagedUserRequest = {
  fullName: string;
  email: string;
  password: string;
  groupId: string;
};

type CreateManagedUserResponse = {
  success: boolean;
  userId: string;
};

export async function createManagedUser(
  data: CreateManagedUserRequest
): Promise<CreateManagedUserResponse> {
  const callable = httpsCallable<
    CreateManagedUserRequest,
    CreateManagedUserResponse
  >(functions, "createManagedUser");

  const result = await callable(data);

  return result.data;
}
