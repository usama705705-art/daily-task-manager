"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/auth/auth-guard";
import LogoutButton from "@/components/auth/logout-button";
import { getUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/lib/firestore-schema";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const roleLabel =
    profile?.role === "super_admin"
      ? "Super Admin"
      : profile?.role === "admin"
        ? "Admin"
        : "User";

  return (
    <AuthGuard>
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              Daily Task Manager
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-welcome">
              Welcome back,{" "}
              {profile?.fullName || user?.displayName || "User"}.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <span className="dashboard-role">
              {loading ? "Loading..." : roleLabel}
            </span>

            <LogoutButton />
          </div>
        </header>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Total Tasks
            </span>

            <strong>0</strong>

            <span className="dashboard-card-note">
              No tasks assigned yet
            </span>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Completed
            </span>

            <strong>0</strong>

            <span className="dashboard-card-note">
              Completed tasks
            </span>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Pending
            </span>

            <strong>0</strong>

            <span className="dashboard-card-note">
              Tasks waiting to be completed
            </span>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Progress
            </span>

            <strong>0%</strong>

            <span className="dashboard-card-note">
              Overall completion
            </span>
          </article>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-eyebrow">
                Overview
              </p>

              <h2>Task Progress</h2>
            </div>
          </div>

          <div className="dashboard-empty-state">
            <div className="dashboard-empty-icon">
              ✓
            </div>

            <h3>No task activity yet</h3>

            <p>
              Your task statistics and progress charts will
              appear here once tasks are created.
            </p>
          </div>
        </section>

        {profile?.role === "admin" && (
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <p className="dashboard-eyebrow">
                  Administration
                </p>

                <h2>Management</h2>
              </div>
            </div>

            <div className="dashboard-management-grid">
              <div className="dashboard-management-card">
                <span>Groups</span>
                <strong>Manage groups</strong>
              </div>

              <div className="dashboard-management-card">
                <span>Users</span>
                <strong>Manage users</strong>
              </div>

              <div className="dashboard-management-card">
                <span>Tasks</span>
                <strong>Manage tasks</strong>
              </div>

              <div className="dashboard-management-card">
                <span>Reports</span>
                <strong>View progress</strong>
              </div>
            </div>
          </section>
        )}
      </main>
    </AuthGuard>
  );
}
