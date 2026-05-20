import { http } from "@/shared/api/http";
import type { AuthUser } from "@/modules/auth/authSlice";

export type LoginResponse = { accessToken: string; user: AuthUser };

export async function login(email: string, password: string) {
  const res = await http.post<{ data: LoginResponse }>("/auth/login", { email, password });
  return res.data.data;
}
