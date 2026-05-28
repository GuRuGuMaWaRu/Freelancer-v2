import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import { authStorageKey, login } from "../shared/api/endpoints";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const user = await login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (user.token) {
      window.localStorage.setItem(authStorageKey, user.token);
      await router.invalidate();
    } else {
      setError("Login succeeded but no token was returned.");
    }
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Login</h1>
      </header>
      <form className="panel" onSubmit={handleSubmit}>
        <label className="form-row">
          Email
          <input className="input" name="email" type="email" required />
        </label>
        <label className="form-row">
          Password
          <input className="input" name="password" type="password" required />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button className="button" type="submit">
          Sign in
        </button>
      </form>
    </>
  );
}
