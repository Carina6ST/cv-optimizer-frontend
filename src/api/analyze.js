import api from "./client";

// Upload a file + JD to /analyze (multipart)
export async function analyzeFile(file, jobDescription, includeAI = true) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("job_description", jobDescription);

  const { data } = await api.post("/analyze", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { include_ai: includeAI },
  });
  return data; // { filename, length_cv_chars, ats, ai }
}

// Analyze plain text (no file) at /analyze/text
export async function analyzeText(cvText, jobDescription, includeAI = true) {
  const fd = new FormData();
  fd.append("cv_text", cvText);
  fd.append("job_description", jobDescription);

  const { data } = await api.post("/analyze/text", fd, {
    params: { include_ai: includeAI },
  });
  return data; // { ats, ai }
}
