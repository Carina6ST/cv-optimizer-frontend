// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const navigate = useNavigate(); // no optional chaining needed

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      // IMPORTANT: send URL-encoded body to match FastAPI Form(...)
      const body = new URLSearchParams();
      body.append("email", email);
      body.append("password", password);

      const { data } = await api.post("/auth/login", body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = data?.access_token;
      if (!token) throw new Error("No access token received");
      localStorage.setItem("token", token);

      setMsg("Signed in! Redirecting…");
      navigate("/dashboard");
    } catch (e) {
      // Show the actual backend message if available
      setErr(e?.response?.data?.detail || e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

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
              className="w-full border rounded p-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border rounded p-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

        {/* Links */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <a className="underline" href="/forgot-password">
            Forgot password?
          </a>
          <a className="underline" href="/register">
            Create an account
          </a>
        </div>

        {/* Messages */}
        {msg && <div className="mt-4 text-green-700 text-sm">{msg}</div>}
        {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}

        {/* Debug tip */}
        <p className="mt-6 text-xs text-gray-500">
          API base:{" "}
          <code className="ml-1 bg-gray-100 px-1 rounded">
            {import.meta.env.VITE_API_URL || "VITE_API_URL not set"}
          </code>
        </p>
      </div>
    </div>
  );
}
