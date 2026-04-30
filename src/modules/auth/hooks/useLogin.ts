import { useMutation } from "@tanstack/react-query";
import { login } from "@/modules/auth/api/authApi";
import type { LoginCredentials, LoginResponse } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials): Promise<LoginResponse> =>
      login(credentials.email, credentials.password),
  });
}
