import { http } from "@/shared/api/http";
import type {
  DailyEntryListQuery,
  DailyEntryListResult,
  DailyEntryPayload,
  DailyEntryRow,
} from "../types";

export const dailyEntryApi = {
  list(query: DailyEntryListQuery = {}) {
    return http
      .get<DailyEntryListResult>("/daily-entries", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: DailyEntryRow }>(`/daily-entries/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: DailyEntryPayload) {
    return http
      .post<{ data: DailyEntryRow }>("/daily-entries", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<DailyEntryPayload>) {
    return http
      .patch<{ data: DailyEntryRow }>(`/daily-entries/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/daily-entries/${id}`);
  },
};
