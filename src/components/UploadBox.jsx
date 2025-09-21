// frontend/src/components/UploadBox.jsx
import React, { useState } from "react";
import { uploadResume } from "../api/resumes";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onUpload = async () => {
    setMsg("");
    setErr("");
    if (!file) return setErr("Choose a file first");
    try {
      const res = await uploadResume(file);
      setMsg(`Uploaded: ${res.filename} (${res.characters} chars)`);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message || "Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={onUpload}>Upload</button>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {err && <div style={{ color: "red" }}>{err}</div>}
    </div>
  );
}
