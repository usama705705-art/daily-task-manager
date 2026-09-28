"use client";

import { FormEvent, useEffect, useState } from "react";

import AuthGuard from "@/components/auth/auth-guard";
import { createGroup, getAccessibleGroups } from "@/lib/firestore";
import type { Group } from "@/lib/firestore-schema";
import { useAuthStore } from "@/store/auth-store";

export default function GroupsPage() {
  const user = useAuthStore((state) => state.user);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadGroups() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const result = await getAccessibleGroups(user.uid);
      setGroups(result);
    } catch {
      setError("Unable to load groups.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, [user]);

  async function handleCreateGroup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (cleanName.length < 2) {
      setError("Group name must be at least 2 characters.");
      return;
    }

    setError("");
    setSuccess("");
    setCreating(true);

    try {
      await createGroup({
        name: cleanName,
        description: cleanDescription || undefined,
        status: "active",
        adminIds: [user.uid],
        createdBy: user.uid,
      });

      setName("");
      setDescription("");
      setSuccess("Group created successfully.");

      await loadGroups();
    } catch {
      setError("Unable to create group.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <AuthGuard>
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">
              Daily Task Manager
            </p>

            <h1>Groups</h1>

            <p className="dashboard-welcome">
              Create and manage your accessible groups.
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-eyebrow">
                New Group
              </p>

              <h2>Create group</h2>
            </div>
          </div>

          <form
            onSubmit={handleCreateGroup}
            className="login-form"
          >
            <div className="form-field">
              <label htmlFor="group-name">
                Group name
              </label>

              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="group-description">
                Description
              </label>

              <input
                id="group-description"
                type="text"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Optional description"
              />
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {success && (
              <p className="login-error">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={creating}
            >
              {creating
                ? "Creating group..."
                : "Create group"}
            </button>
          </form>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-eyebrow">
                Your Groups
              </p>

              <h2>Accessible groups</h2>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty-state">
              <h3>Loading groups...</h3>
            </div>
          ) : groups.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                +
              </div>

              <h3>No groups yet</h3>

              <p>
                Create your first group to start managing
                users and tasks.
              </p>
            </div>
          ) : (
            <div className="dashboard-management-grid">
              {groups.map((group) => (
                <article
                  key={group.id}
                  className="dashboard-management-card"
                >
                  <span>{group.status}</span>

                  <strong>{group.name}</strong>

                  {group.description && (
                    <span>
                      {group.description}
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
                  }
