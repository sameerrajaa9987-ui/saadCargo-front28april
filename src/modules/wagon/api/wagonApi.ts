import { http } from "@/shared/api/http";
import type {
  WagonListQuery,
  WagonListResult,
  WagonPayload,
  WagonRow,
} from "../types";

export const wagonApi = {
  list(query: WagonListQuery = {}) {
    return http
      .get<WagonListResult>("/wagons", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: WagonRow }>(`/wagons/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: WagonPayload) {
    return http
      .post<{ data: WagonRow }>("/wagons", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<WagonPayload>) {
    return http
      .patch<{ data: WagonRow }>(`/wagons/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/wagons/${id}`);
  },
};
