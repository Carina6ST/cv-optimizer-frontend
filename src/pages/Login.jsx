import React, { useState } from "react";
import api from "../api/client";

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(url, { email, password });
      localStorage.setItem("token", data.access_token);
      onAuthed();
    } catch (e) {
      setErr(e.response?.data?.detail || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">CV Optimizer</h1>
        <input className="w-full border p-3 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="w-full bg-black text-white p-3 rounded">{
          mode === "login" ? "Sign In" : "Create Account"
        }</button>
        <div className="text-center text-sm">
          {mode === "login" ? (
            <span>New? <button type="button" className="underline" onClick={()=>setMode('register')}>Create an account</button></span>
          ) : (
            <span>Have an account? <button type="button" className="underline" onClick={()=>setMode('login')}>Sign in</button></span>
          )}
        </div>
      </form>
    </div>
  );
}
