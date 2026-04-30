import { http } from "@/shared/api/http";
import type {
  RailwayBookingListQuery,
  RailwayBookingListResult,
  RailwayBookingPayload,
  RailwayBookingRow,
} from "../types";

export const railwayBookingApi = {
  list(query: RailwayBookingListQuery = {}) {
    return http
      .get<RailwayBookingListResult>("/railway-bookings", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: RailwayBookingRow }>(`/railway-bookings/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: RailwayBookingPayload) {
    return http
      .post<{ data: RailwayBookingRow }>("/railway-bookings", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<RailwayBookingPayload>) {
    return http
      .patch<{ data: RailwayBookingRow }>(`/railway-bookings/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/railway-bookings/${id}`);
  },
};
