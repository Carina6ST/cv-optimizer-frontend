import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const navigate = useNavigate?.() ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErr("Please use at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Register
      const { data } = await api.post("/auth/register", { email, password });
      const token = data?.access_token;

      if (token) {
        // Some backends return token on register; if so, auto-login:
        localStorage.setItem("token", token);
        setMsg("Account created! Redirecting…");
        if (navigate) navigate("/dashboard");
        else window.location.href = "/dashboard";
      } else {
        // If your backend does not return token on register:
        setMsg("Account created! Please sign in.");
        if (navigate) navigate("/");
        else window.location.href = "/";
      }
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">
          Start tailoring your CV to job descriptions in minutes.
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
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <input
              type="password"
              required
              className="w-full border rounded p-3"
              placeholder="********"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded py-2.5 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* Links */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <a className="underline" href="/">
            Already have an account? Sign in
          </a>
          <a className="underline" href="/forgot-password">
            Forgot password?
          </a>
        </div>

        {/* Messages */}
        {msg && <div className="mt-4 text-green-700 text-sm">{msg}</div>}
        {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}

        <p className="mt-6 text-xs text-gray-500">
          By creating an account, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
