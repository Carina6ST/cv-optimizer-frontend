import React from "react";

export default function AnalysisCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analysis</h3>
        <span className="text-sm px-2 py-1 rounded bg-gray-100">{data.readability?.label} · {data.readability?.grade_level}</span>
      </div>
      <div>
        <h4 className="font-medium">Matched Keywords</h4>
        <p className="text-sm">{data.matched_keywords?.join(", ") || "—"}</p>
      </div>
      <div>
        <h4 className="font-medium">Missing Keywords</h4>
        <div className="flex flex-wrap gap-2">
          {(data.missing_keywords || []).map((k) => <span key={k} className="text-xs bg-yellow-100 px-2 py-1 rounded">{k}</span>)}
        </div>
      </div>
      <div>
        <h4 className="font-medium">Improved Summary</h4>
        <p className="text-sm whitespace-pre-wrap">{data.improved_summary}</p>
      </div>
      <div>
        <h4 className="font-medium">Suggested Bullets</h4>
        <ul className="list-disc list-inside text-sm">
          {(data.improved_bullets || []).map((b,i)=><li key={i}>{b}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-medium">Cover Letter (draft)</h4>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">{data.cover_letter}</pre>
      </div>
      <div>
        <h4 className="font-medium">ATS Check</h4>
        <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">{JSON.stringify(data.ats_check, null, 2)}</pre>
      </div>
    </div>
  );
}
