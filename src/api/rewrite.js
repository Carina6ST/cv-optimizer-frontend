import api from "./client";

// Pro-only: rewrite CV text to align with JD
export async function rewriteCv(cvText, jobDescription) {
  const fd = new FormData();
  fd.append("cv_text", cvText);
  fd.append("job_description", jobDescription);
  const { data } = await api.post("/rewrite", fd);
  return data; // { rewritten }
}
