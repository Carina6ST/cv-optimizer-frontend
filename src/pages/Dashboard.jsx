import React, { useState } from "react";
import UploadBox from "../components/UploadBox";
import AnalysisCard from "../components/AnalysisCard";
import api from "../api/client";

export default function Dashboard({ onLogout }) {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const runAnalysis = async () => {
    if (!resume) { setErr("Upload a resume first"); return; }
    setErr("");
    try {
      setLoading(true);
      const { data } = await api.post("/analyze", { resume_id: resume.id, job_description: job });
      setAnalysis(data);
    } catch (e) {
      setErr(e.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-xl font-semibold">CV Optimizer</h1>
        <button onClick={onLogout} className="text-sm underline">Log out</button>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <UploadBox onUploaded={setResume} />
        {resume && <div className="bg-white p-4 rounded-xl shadow text-sm">
          <strong>Uploaded:</strong> {resume.filename}
        </div>}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <textarea className="w-full border p-3 rounded" rows="5" placeholder="Paste a job description (optional but recommended)" value={job} onChange={e=>setJob(e.target.value)} />
          <button className="bg-black text-white px-4 py-2 rounded" onClick={runAnalysis} disabled={loading}>{loading ? "Analyzing..." : "Analyze & Improve"}</button>
          {err && <div className="text-red-600 text-sm">{err}</div>}
        </div>
        {analysis && <AnalysisCard data={analysis} />}
      </main>
    </div>
  );
}
