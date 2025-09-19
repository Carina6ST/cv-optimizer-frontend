import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  return authed ? <Dashboard onLogout={() => {localStorage.removeItem('token'); setAuthed(false)}}/> : <Login onAuthed={()=>setAuthed(true)} />;
}
