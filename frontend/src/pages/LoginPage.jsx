import { useState } from "react";
import { api } from "../api";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function login(event) {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      const data = await api("/api/sso/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });
      onLogin(data);
    } catch (err) {
      setError("The username or password is incorrect.");
    }
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <div className="login-intro">
          <span className="kicker">Motel Management System</span>
          <h1>Boarding House Management</h1>
          <p>Track rooms, tenants, invoices, and payments in one clear workspace.</p>
        </div>

        <form className="login-form" onSubmit={login}>
          <h2>Login</h2>
          {error && <div className="alert error">{error}</div>}
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              autoComplete="current-password"
            />
          </label>
          <button className="primary-button">Login</button>
        </form>
      </section>
    </main>
  );
}
