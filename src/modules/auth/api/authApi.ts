import { http } from "@/shared/api/http";
import type { LoginResponse } from "../types";

export async function login(email: string, password: string) {
  const res = await http.post<{ data: LoginResponse }>("/auth/login", {
    email,
    password,
  });
  return res.data.data;
}
