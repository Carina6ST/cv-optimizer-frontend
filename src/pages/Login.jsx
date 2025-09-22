// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const navigate = (() => {
    try {
      return useNavigate();
    } catch {
      return null;
    }
  })();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      // POST /auth/login -> { access_token, token_type }
      const res = await api.post("/auth/login", { email, password });
      const token = res?.data?.access_token;

      if (!token) throw new Error("No access token returned from server.");

      // persist the JWT
      localStorage.setItem("token", token);

      setMsg("Signed in! Redirecting…");
      // small delay so the success message is visible
      setTimeout(() => {
        if (navigate) navigate("/dashboard");
        else window.location.assign("/dashboard");
      }, 300);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Login failed";
      setErr(apiMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in to continue optimizing your CV.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full border rounded p-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full border rounded p-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded py-2.5 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm">
          <Link className="underline" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="underline" to="/register">
            Create an account
          </Link>
        </div>

        {msg && <div className="mt-4 text-green-700 text-sm">{msg}</div>}
        {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}

        <p className="mt-6 text-xs text-gray-500">
          API base:{" "}
          <code className="bg-gray-100 px-1 rounded">
            {import.meta.env.VITE_API_URL || "(VITE_API_URL not set)"}
          </code>
        </p>
      </div>
    </div>
  );
}
