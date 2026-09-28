export type UserRole = "super_admin" | "admin" | "user";

export type AccountStatus = "active" | "inactive" | "suspended";

export type GroupStatus = "active" | "inactive";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;

  // Groups this user belongs to.
  groupIds: string[];

  // Admins who are allowed to manage this user.
  // Super Admin is not required to be listed here.
  adminIds: string[];

  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  status: GroupStatus;

  // Admins assigned to this group.
  adminIds: string[];

  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupAdmin = {
  id: string;
  groupId: string;
  adminId: string;
  assignedBy: string;
  createdAt: string;
};

export type GroupUser = {
  id: string;
  groupId: string;
  userId: string;
  addedBy: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  groupId: string;
  priority: TaskPriority;
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskAssignment = {
  id: string;
  taskId: string;
  userId: string;
  assignedBy: string;
  status: TaskStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  groupId?: string;
  details?: string;
  createdAt: string;
};

export type ProgressStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionPercentage: number;
};
