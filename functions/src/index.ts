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

    const adminId = request.auth.uid;

    const adminSnapshot = await db
      .collection("users")
      .doc(adminId)
      .get();

    if (!adminSnapshot.exists) {
      throw new HttpsError(
        "permission-denied",
        "Admin profile was not found."
      );
    }

    const adminData = adminSnapshot.data();

    if (
      adminData?.status !== "active" ||
      !["admin", "super_admin"].includes(
        adminData.role
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
    const password = data.password ?? "";
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

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
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
      adminData.role === "super_admin";

    const isGroupAdmin =
      Array.isArray(groupData?.adminIds) &&
      groupData.adminIds.includes(adminId);

    if (!isSuperAdmin && !isGroupAdmin) {
      throw new HttpsError(
        "permission-denied",
        "You do not manage this group."
      );
    }

    let firebaseUser;

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

      const userDocument: UserDocument = {
        fullName,
        email,
        role: "user",
        status: "active",
        groupIds: [groupId],
        adminIds: isSuperAdmin
          ? []
          : [adminId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const groupUserReference = db
        .collection("group_users")
        .doc(`${groupId}_${userId}`);

      const batch = db.batch();

      batch.set(userReference, userDocument);

      batch.set(groupUserReference, {
        groupId,
        userId,
        addedBy: adminId,
        status: "active",
        createdAt: FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return {
        success: true,
        userId,
      };
    } catch (error) {
      if (firebaseUser) {
        try {
          await auth.deleteUser(firebaseUser.uid);
        } catch {
          // Prevent cleanup errors from replacing
          // the original operation error.
        }
      }

      if (error instanceof HttpsError) {
        throw error;
      }

      throw new HttpsError(
        "internal",
        "Unable to create the user."
      );
    }
  }
);
