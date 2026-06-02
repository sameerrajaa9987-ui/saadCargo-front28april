import axios from "axios";
import { store } from "@/app/store";
import { clearAuth } from "@/modules/auth/authSlice";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      const hasToken = Boolean(store.getState().auth.accessToken);
      if (hasToken) store.dispatch(clearAuth());
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  },
);

type ApiValidationIssue = { path?: Array<string | number>; message?: string };
type ApiErrorResponse = {
  error?: { message?: string; details?: { issues?: ApiValidationIssue[] } };
};

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) return String(data.error.message);
    const issueMsg = data?.error?.details?.issues?.[0]?.message;
    if (issueMsg) return String(issueMsg);
    if (err.message) return err.message;
  }
  return "Something went wrong";
}
