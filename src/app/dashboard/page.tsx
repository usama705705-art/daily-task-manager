"use client";

import AuthGuard from "@/components/auth/auth-guard";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <AuthGuard>
      <main className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              Daily Task Manager
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-welcome">
              Welcome back, {user?.displayName || "User"}.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Total Tasks
            </span>

            <strong>0</strong>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Completed
            </span>

            <strong>0</strong>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Pending
            </span>

            <strong>0</strong>
          </article>

          <article className="dashboard-card">
            <span className="dashboard-card-label">
              Progress
            </span>

            <strong>0%</strong>
          </article>
        </section>
      </main>
    </AuthGuard>
  );
}
