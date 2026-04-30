import { http } from "@/shared/api/http";
import type {
  BookingListQuery,
  BookingListResult,
  BookingPayload,
  BookingRow,
} from "../types";

export const bookingApi = {
  list(query: BookingListQuery = {}) {
    return http
      .get<BookingListResult>("/bookings", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: BookingRow }>(`/bookings/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: BookingPayload) {
    return http
      .post<{ data: BookingRow }>("/bookings", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<BookingPayload>) {
    return http
      .patch<{ data: BookingRow }>(`/bookings/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/bookings/${id}`);
  },
};
