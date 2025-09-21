import React, { useState } from "react";
import { requestPasswordReset } from "../api/auth-extra";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await requestPasswordReset(email);
      setMsg("If an account exists, we sent a reset link. Check your email.");
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <p className="text-sm text-gray-600">
          Enter your email and we’ll send a reset link.
        </p>
        <input
          className="w-full border p-3 rounded"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded w-full">
          Send reset link
        </button>
        {msg && <div className="text-green-700 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </form>
    </div>
  );
}
