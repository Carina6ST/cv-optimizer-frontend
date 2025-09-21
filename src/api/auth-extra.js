import api from "./client";

export async function requestPasswordReset(email) {
  const { data } = await api.post("/auth/request-reset", { email });
  return data;
}

export async function applyPasswordReset(token, new_password) {
  const { data } = await api.post("/auth/reset-password", {
    token,
    new_password,
  });
  return data;
}
