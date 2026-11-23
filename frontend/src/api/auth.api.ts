import api from "./axios";
import type { AdminUser } from "../types";

interface LoginResponse {
  token: string;
  user: AdminUser;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
};
