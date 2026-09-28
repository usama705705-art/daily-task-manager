import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";

import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

initializeApp();

const auth = getAuth();
const db = getFirestore();

type CreateUserRequest = {
  fullName: string;
  email: string;
  password: string;
  groupId: string;
};

type UserDocument = {
  fullName: string;
  email: string;
  role: "user";
  status: "active";
  groupIds: string[];
  adminIds: string[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export const createManagedUser = onCall(
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Authentication is required."
      );
    }

    const creatorId = request.auth.uid;

    const creatorSnapshot = await db
      .collection("users")
      .doc(creatorId)
      .get();

    if (!creatorSnapshot.exists) {
      throw new HttpsError(
        "permission-denied",
        "Account profile was not found."
      );
    }

    const creatorData = creatorSnapshot.data();

    if (
      creatorData?.status !== "active" ||
      !["admin", "super_admin"].includes(
        creatorData.role
      )
    ) {
      throw new HttpsError(
        "permission-denied",
        "You are not allowed to create users."
      );
    }

    const data =
      request.data as Partial<CreateUserRequest>;

    const fullName = cleanString(data.fullName);
    const email = cleanString(data.email).toLowerCase();
    const password =
      typeof data.password === "string"
        ? data.password
        : "";
    const groupId = cleanString(data.groupId);

    if (fullName.length < 2) {
      throw new HttpsError(
        "invalid-argument",
        "Full name must be at least 2 characters."
      );
    }

    if (!email || !email.includes("@")) {
      throw new HttpsError(
        "invalid-argument",
        "A valid email address is required."
      );
    }

    if (password.length < 8) {
      throw new HttpsError(
        "invalid-argument",
        "Password must be at least 8 characters."
      );
    }

    if (!groupId) {
      throw new HttpsError(
        "invalid-argument",
        "A group is required."
      );
    }

    const groupReference = db
      .collection("groups")
      .doc(groupId);

    const groupSnapshot = await groupReference.get();

    if (!groupSnapshot.exists) {
      throw new HttpsError(
        "not-found",
        "The selected group was not found."
      );
    }

    const groupData = groupSnapshot.data();

    const isSuperAdmin =
      creatorData.role === "super_admin";

    const groupAdminIds = Array.isArray(
      groupData?.adminIds
    )
      ? groupData.adminIds.filter(
          (value): value is string =>
            typeof value === "string"
        )
      : [];

    const isGroupAdmin =
      groupAdminIds.includes(creatorId);

    if (!isSuperAdmin && !isGroupAdmin) {
      throw new HttpsError(
        "permission-denied",
        "You do not manage this group."
      );
    }

    let firebaseUser:
      | Awaited<ReturnType<typeof auth.createUser>>
      | null = null;

    try {
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: fullName,
        disabled: false,
      });

      const userId = firebaseUser.uid;

      const userReference = db
        .collection("users")
        .doc(userId);

      const groupUserReference = db
        .collection("group_users")
        .doc(`${groupId}_${userId}`);

      const userDocument: UserDocument = {
        fullName,
        email,
        role: "user",
        status: "active",
        groupIds: [groupId],

        // Every Admin managing this group can see
        // and manage the new user.
        adminIds: groupAdminIds,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const batch = db.batch();

      batch.set(userReference, userDocument);

      batch.set(groupUserReference, {
        groupId,
        userId,
        addedBy: creatorId,
        status: "active",
        createdAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return {
        success: true,
        userId,
      };
    } catch (error) {
      if (
        error instanceof HttpsError
      ) {
        throw error;
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code ===
          "auth/email-already-exists"
      ) {
        throw new HttpsError(
          "already-exists",
          "An account with this email already exists."
        );
      }

      if (firebaseUser) {
        try {
          await auth.deleteUser(
            firebaseUser.uid
          );
        } catch {
          // Preserve the original operation error.
        }
      }

      throw new HttpsError(
        "internal",
        "Unable to create the user."
      );
    }
  }
);
