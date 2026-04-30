import { http } from "@/shared/api/http";
import type {
  ClientListQuery,
  ClientListResult,
  ClientPayload,
  ClientRow,
} from "../types";

export const clientApi = {
  list(query: ClientListQuery = {}) {
    return http
      .get<ClientListResult>("/clients", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  listAll() {
    return http
      .get<{ data: ClientRow[] }>("/clients/all")
      .then((res) => res.data.data);
  },
  get(id: string) {
    return http
      .get<{ data: ClientRow }>(`/clients/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: ClientPayload) {
    return http
      .post<{ data: ClientRow }>("/clients", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<ClientPayload>) {
    return http
      .patch<{ data: ClientRow }>(`/clients/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/clients/${id}`);
  },
};
