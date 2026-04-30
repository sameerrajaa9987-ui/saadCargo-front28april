import { http } from "@/shared/api/http";
import type {
  UserListQuery,
  UserListResult,
  UserPayload,
  UserRow,
} from "../types";

export const userApi = {
  list(query: UserListQuery = {}) {
    return http
      .get<UserListResult>("/users", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: UserRow }>(`/users/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: UserPayload) {
    return http
      .post<{ data: UserRow }>("/users", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<UserPayload>) {
    return http
      .patch<{ data: UserRow }>(`/users/${id}`, payload)
      .then((res) => res.data.data);
  },
  resetPassword(id: string, password: string) {
    return http
      .post<{ data: UserRow }>(`/users/${id}/reset-password`, { password })
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/users/${id}`);
  },
};
