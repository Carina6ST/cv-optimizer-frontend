import React, { useState, useCallback } from "react";
import { analyzeFile, analyzeText } from "../api/analyze";
import { rewriteCv } from "../api/rewrite";

// Reusable components outside main function for better performance
const Score = React.memo(({ label, value }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-700">{label}</span>
    <span className="font-semibold">{Math.round((value ?? 0) * 100)}%</span>
  </div>
));

const List = React.memo(({ title, items }) => (
  <div className="bg-gray-50 border rounded p-3">
    <div className="font-semibold mb-2">{title}</div>
    {!items || items.length === 0 ? (
      <div className="text-sm text-gray-500">None found</div>
    ) : (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="text-xs bg-white border rounded px-2 py-1"
          >
            {Array.isArray(item) ? item[0] : item}
          </span>
        ))}
      </div>
    )}
  </div>
));

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [cvTextForRewrite, setCvTextForRewrite] = useState("");
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'text'

  const resetState = useCallback(() => {
    setError("");
    setResults(null);
    setRewritten("");
  }, []);

  const handleApiError = useCallback((error, defaultMessage) => {
    const message =
      error?.response?.data?.detail || error.message || defaultMessage;
    setError(message);
    return message;
  }, []);

  const onAnalyze = async (e) => {
    e?.preventDefault?.();
    resetState();

    if (!file || !jd.trim()) {
      setError("Please choose a CV file and paste the job description.");
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeFile(file, jd, true);
      setResults(data);
      // Pre-fill the rewrite textarea with extracted text if available
      if (data.extractedText) {
        setCvTextForRewrite(data.extractedText);
      }
    } catch (error) {
      handleApiError(error, "Error while analyzing file");
    } finally {
      setLoading(false);
    }
  };

  const onAnalyzeTextOnly = async () => {
    resetState();

    if (!cvTextForRewrite.trim() || !jd.trim()) {
      setError("Please paste both CV text and the job description.");
      return;
    }

    try {
      setLoading(true);
      const data = await analyzeText(cvTextForRewrite, jd, true);
      setResults(data);
    } catch (error) {
      handleApiError(error, "Error while analyzing text");
    } finally {
      setLoading(false);
    }
  };

  const onRewrite = async () => {
    resetState();

    if (!cvTextForRewrite.trim() || !jd.trim()) {
      setError(
        "Please paste your CV text and the job description before rewriting."
      );
      return;
    }

    try {
      setLoading(true);
      const data = await rewriteCv(cvTextForRewrite, jd);
      setRewritten(data.rewritten || "");
    } catch (error) {
      if (error?.response?.status === 402) {
        setError("Pro feature: Please upgrade your plan to use CV rewrite.");
      } else {
        handleApiError(error, "Error while rewriting CV");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <>
        {/* ATS Scores */}
        <div className="bg-gray-50 border rounded p-4">
          <h3 className="font-semibold mb-3 text-lg">ATS Score Analysis</h3>
          <Score label="Overall Score" value={results.ats?.score_overall} />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Score
              label="Required Skills"
              value={results.ats?.required_coverage}
            />
            <Score
              label="Optional Skills"
              value={results.ats?.optional_coverage}
            />
            <Score
              label="Technical Skills"
              value={results.ats?.by_category?.tech}
            />
            <Score label="Soft Skills" value={results.ats?.by_category?.soft} />
            <Score
              label="Business Acumen"
              value={results.ats?.by_category?.business}
            />
            <Score
              label="Education"
              value={results.ats?.by_category?.education}
            />
            <Score
              label="Certifications"
              value={results.ats?.by_category?.certs}
            />
            <Score
              label="Conditions"
              value={results.ats?.by_category?.conditions}
            />
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <List
            title="Missing Required Skills"
            items={results.ats?.gaps_required}
          />
          <List
            title="Job Requirements (Required)"
            items={results.ats?.jd_required}
          />
          <List
            title="Job Requirements (Optional)"
            items={results.ats?.jd_optional}
          />
          <List
            title="Your Technical Skills"
            items={results.ats?.present?.tech}
          />
        </div>

        {/* AI Suggestions */}
        {results.ai && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold mb-3 text-blue-800">AI Suggestions</h3>
            {results.ai.summary && (
              <div className="text-sm text-blue-700 mb-3 p-2 bg-blue-100 rounded">
                {results.ai.summary}
              </div>
            )}
            {results.ai.missing_skills?.length > 0 && (
              <List
                title="Recommended Skills to Add"
                items={results.ai.missing_skills}
              />
            )}
            {results.ai.phrasing_tips?.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold mb-2 text-blue-800">
                  Phrasing Tips
                </h4>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  {results.ai.phrasing_tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              CV Optimizer
            </h1>
            <p className="text-gray-600">
              Analyze your CV against job descriptions and get AI-powered
              improvements
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "upload"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload CV
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "text"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("text")}
            >
              Paste Text
            </button>
          </div>

          <div className="space-y-4">
            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste the job description here…"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                required
              />
            </div>

            {/* File Upload Tab */}
            {activeTab === "upload" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV File (PDF/DOCX/TXT) *
                </label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  accept=".pdf,.docx,.doc,.txt"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOCX, DOC, TXT
                </p>
              </div>
            )}

            {/* Text Input Tab */}
            {activeTab === "text" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV Text *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste your CV text here…"
                  value={cvTextForRewrite}
                  onChange={(e) => setCvTextForRewrite(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={activeTab === "upload" ? onAnalyze : onAnalyzeTextOnly}
                disabled={
                  loading ||
                  !jd.trim() ||
                  (activeTab === "upload" ? !file : !cvTextForRewrite.trim())
                }
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Analyzing…" : "Analyze CV"}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Analysis Results
          </h2>

          {!results ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <p className="text-gray-500">
                Run an analysis to see your ATS score, skill gaps, and AI
                suggestions
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {renderResults()}

              {/* Rewrite Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">
                  Pro Feature: CV Rewrite
                </h3>
                <p className="text-sm text-purple-700 mb-3">
                  Optimize your CV text to better match the job description (we
                  never invent experience)
                </p>

                <textarea
                  className="w-full border border-purple-300 rounded-lg p-3 h-32 mb-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Paste your CV text to rewrite…"
                  value={cvTextForRewrite}
                  onChange={(e) => setCvTextForRewrite(e.target.value)}
                />

                <button
                  onClick={onRewrite}
                  disabled={loading || !cvTextForRewrite.trim() || !jd.trim()}
                  className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Rewriting…" : "Rewrite CV (Pro)"}
                </button>

                {rewritten && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Optimized CV Text
                    </h4>
                    <div className="bg-white border border-purple-200 rounded-lg p-3">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {rewritten}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
