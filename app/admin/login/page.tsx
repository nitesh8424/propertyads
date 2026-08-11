"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Invalid email or password"
        );
      }

      router.push("/admin/properties/new");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login"
      );

      setBusy(false);
    }
  };

  return (
    <main className="adminLoginPage">
      <div className="adminLoginCard">
        <div className="adminLoginHeader">
          <h1>Admin Login</h1>

          <p>
            Login to manage properties
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="adminLoginForm"
        >
          <div className="formGroup">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter admin email"
              autoComplete="email"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="errorMessage">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="greenBtn"
            disabled={busy}
          >
            {busy
              ? "Signing in..."
              : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}