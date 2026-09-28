import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

import type {
  Group,
  GroupAdmin,
  GroupUser,
  Task,
  TaskAssignment,
  UserProfile,
} from "./firestore-schema";

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as UserProfile;
}

export async function createUserProfile(
  userId: string,
  profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
) {
  await setDoc(doc(db, "users", userId), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getAccessibleGroups(
  adminId: string
): Promise<Group[]> {
  const groupsQuery = query(
    collection(db, "groups"),
    where("adminIds", "array-contains", adminId)
  );

  const snapshot = await getDocs(groupsQuery);

  return snapshot.docs.map((groupDoc) => ({
    id: groupDoc.id,
    ...groupDoc.data(),
  })) as Group[];
}

export async function createGroup(
  group: Omit<Group, "id" | "createdAt" | "updatedAt">
) {
  const reference = await addDoc(collection(db, "groups"), {
    ...group,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return reference.id;
}

export async function createGroupAdmin(
  membership: Omit<GroupAdmin, "id" | "createdAt">
) {
  const membershipId = `${membership.groupId}_${membership.adminId}`;

  await setDoc(doc(db, "group_admins", membershipId), {
    ...membership,
    createdAt: serverTimestamp(),
  });

  return membershipId;
}

export async function createGroupUser(
  membership: Omit<GroupUser, "id" | "createdAt">
) {
  const membershipId = `${membership.groupId}_${membership.userId}`;

  await setDoc(doc(db, "group_users", membershipId), {
    ...membership,
    createdAt: serverTimestamp(),
  });

  return membershipId;
}

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
) {
  const reference = await addDoc(collection(db, "tasks"), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return reference.id;
}

export async function createTaskAssignment(
  assignment: Omit<
    TaskAssignment,
    "id" | "createdAt" | "updatedAt"
  >
) {
  const assignmentId = `${assignment.taskId}_${assignment.userId}`;

  await setDoc(doc(db, "task_assignments", assignmentId), {
    ...assignment,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return assignmentId;
}
