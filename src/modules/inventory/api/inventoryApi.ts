import { http } from "@/shared/api/http";
import type {
  InventoryListQuery,
  InventoryListResult,
  InventoryPayload,
  InventoryRow,
} from "../types";

export const inventoryApi = {
  list(query: InventoryListQuery = {}) {
    return http
      .get<InventoryListResult>("/inventory", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: InventoryRow }>(`/inventory/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: InventoryPayload) {
    return http
      .post<{ data: InventoryRow }>("/inventory", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<InventoryPayload>) {
    return http
      .patch<{ data: InventoryRow }>(`/inventory/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/inventory/${id}`);
  },
};
