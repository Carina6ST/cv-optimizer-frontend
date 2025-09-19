import React, { useRef, useState } from "react";
import api from "../api/client";

export default function UploadBox({ onUploaded }) {
  const ref = useRef();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const f = ref.current?.files?.[0];
    if (!f) { setErr("Choose a PDF or DOCX"); return; }
    const fd = new FormData();
    fd.append("file", f);
    try {
      setLoading(true);
      const { data } = await api.post("/resume/upload", fd, { headers: { "Content-Type": "multipart/form-data" }});
      onUploaded(data);
    } catch (e) {
      setErr(e.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="border-2 border-dashed rounded-xl p-6 space-y-3">
      <input ref={ref} type="file" accept=".pdf,.docx" />
      <button className="bg-black text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
      {err && <div className="text-red-600 text-sm">{err}</div>}
    </form>
  );
}
