// src/api/resumes.js
import api from "./client";

export async function uploadResume(file) {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const { data } = await api.post("/resumes/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { id?, filename, characters, preview }
  } catch (e) {
    console.error("Upload error", e?.response?.status, e?.response?.data);
    throw e;
  }
}
