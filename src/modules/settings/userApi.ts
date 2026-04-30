import { http } from "@/shared/api/http";
import type { ApiList, ApiSingle, UserRow } from "@/shared/types";

export const userApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<UserRow>>("/users", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<UserRow>>("/users", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<UserRow>>(`/users/${id}`, data)
      .then((r) => r.data.data);
  },
  resetPassword(id: string, password: string) {
    return http
      .post(`/users/${id}/reset-password`, { password })
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/users/${id}`);
  },
};
