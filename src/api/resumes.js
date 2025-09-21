import api from "./client";
export async function uploadResume(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/resumes/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
