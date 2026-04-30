import { http } from "@/shared/api/http";
import type { ApiList, ApiSingle, BookingRow } from "@/shared/types";

export const bookingApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http.get<ApiList<BookingRow>>("/bookings", { params }).then((r) => ({
      items: r.data.data,
      meta: r.data.meta,
    }));
  },
  get(id: string) {
    return http
      .get<ApiSingle<BookingRow>>(`/bookings/${id}`)
      .then((r) => r.data.data);
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<BookingRow>>("/bookings", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<BookingRow>>(`/bookings/${id}`, data)
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/bookings/${id}`);
  },
};
