import React, { useState, useEffect } from "react";
import { applyPasswordReset } from "../api/auth-extra";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    setToken(url.searchParams.get("token") || "");
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await applyPasswordReset(token, password);
      setMsg("Password updated! You can now sign in.");
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
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <input
          className="w-full border p-3 rounded"
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded w-full">
          Update password
        </button>
        {msg && <div className="text-green-700 text-sm">{msg}</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </form>
    </div>
  );
}
