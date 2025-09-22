// src/api/resumes.js
import api from "./client";

/**
 * Upload a resume file to /resumes/upload.
 * Requires a valid JWT in localStorage under "token".
 * Returns { filename, characters, preview } from the API.
 */
export async function uploadResume(file) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  // Prefer the axios interceptor, but also attach Authorization explicitly as a guard
  const token = localStorage.getItem("token");

  const { data } = await api.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return data;
}
