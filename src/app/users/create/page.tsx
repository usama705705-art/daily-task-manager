"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthGuard from "@/components/auth/auth-guard";
import {
  createManagedUser,
  getAccessibleGroups,
} from "@/lib/firestore-client";
import type { Group } from "@/lib/firestore-schema";
import { useAuthStore } from "@/store/auth-store";

export default function CreateUserPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [creating, setCreating] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [groupId, setGroupId] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGroups() {
      if (!user) {
        setLoadingGroups(false);
        return;
      }

      try {
        const result = await getAccessibleGroups(user.uid);
        setGroups(result);
      } catch {
        setError("Unable to load groups.");
      } finally {
        setLoadingGroups(false);
      }
    }

    loadGroups();
  }, [user]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!groupId) {
      setError("Please select a group.");
      return;
    }

    setError("");
    setCreating(true);

    try {
      await createManagedUser({
        fullName: cleanName,
        email: cleanEmail,
        password,
        groupId,
      });

      router.replace("/users");
    } catch {
      setError("Unable to create the user.");
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
              User Management
            </p>

            <h1>Create User</h1>

            <p className="dashboard-welcome">
              Create a user account and assign it to a group.
            </p>
          </div>
        </header>

        <section className="dashboard-section">
          <form
            onSubmit={handleSubmit}
            className="login-form"
          >
            <div className="form-field">
              <label htmlFor="full-name">
                Full name
              </label>

              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Enter full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="user-email">
                Email
              </label>

              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="user@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="user-password">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  id="user-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="user-group">
                Group
              </label>

              <select
                id="user-group"
                value={groupId}
                onChange={(event) =>
                  setGroupId(event.target.value)
                }
                disabled={loadingGroups}
                required
              >
                <option value="">
                  {loadingGroups
                    ? "Loading groups..."
                    : "Select a group"}
                </option>

                {groups.map((group) => (
                  <option
                    key={group.id}
                    value={group.id}
                  >
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={creating || loadingGroups}
            >
              {creating
                ? "Creating user..."
                : "Create user"}
            </button>
          </form>
        </section>
      </main>
    </AuthGuard>
  );
                  }
