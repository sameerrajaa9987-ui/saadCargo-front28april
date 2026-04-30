import { http } from "@/shared/api/http";
import type {
  PaymentListQuery,
  PaymentListResult,
  PaymentPayload,
  PaymentRow,
} from "../types";

export const paymentApi = {
  list(query: PaymentListQuery = {}) {
    return http
      .get<PaymentListResult>("/payments", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  get(id: string) {
    return http
      .get<{ data: PaymentRow }>(`/payments/${id}`)
      .then((res) => res.data.data);
  },
  create(payload: PaymentPayload) {
    return http
      .post<{ data: PaymentRow }>("/payments", payload)
      .then((res) => res.data.data);
  },
  update(id: string, payload: Partial<PaymentPayload>) {
    return http
      .patch<{ data: PaymentRow }>(`/payments/${id}`, payload)
      .then((res) => res.data.data);
  },
  remove(id: string) {
    return http.delete(`/payments/${id}`);
  },
};
