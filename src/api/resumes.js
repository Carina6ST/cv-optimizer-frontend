import api from "./client";

export async function uploadResume(file) {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const { data } = await api.post("/resumes/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (e) {
    console.error("Upload error:", {
      url: api.defaults.baseURL + "/resumes/upload",
      status: e?.response?.status,
      data: e?.response?.data,
    });
    throw e;
  }
}
