"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/auth/auth-guard";
import { getManagedUsers } from "@/lib/firestore";
import type { UserProfile } from "@/lib/firestore-schema";
import { useAuthStore } from "@/store/auth-store";

export default function UsersPage() {
  const user = useAuthStore((state) => state.user);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await getManagedUsers(user.uid);
        setUsers(result);
      } catch {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [user]);

  return (
    <AuthGuard>
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              Daily Task Manager
            </p>

            <h1>Users</h1>

            <p className="dashboard-welcome">
              Manage users assigned to your groups.
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-eyebrow">
                User Management
              </p>

              <h2>Managed users</h2>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty-state">
              <h3>Loading users...</h3>
            </div>
          ) : error ? (
            <div className="dashboard-empty-state">
              <h3>Unable to load users</h3>

              <p>{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                +
              </div>

              <h3>No users yet</h3>

              <p>
                Users assigned to your groups will appear
                here.
              </p>
            </div>
          ) : (
            <div className="dashboard-management-grid">
              {users.map((profile) => (
                <article
                  key={profile.id}
                  className="dashboard-management-card"
                >
                  <span>{profile.status}</span>

                  <strong>{profile.fullName}</strong>

                  <span>{profile.email}</span>

                  <span>
                    {profile.groupIds.length} group
                    {profile.groupIds.length === 1
                      ? ""
                      : "s"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}
