import { createResourceApi } from "@/modules/common/createResourceApi";
import type { Payment, PaymentListQuery, PaymentCreatePayload } from "../types";

const api = createResourceApi<Payment, PaymentListQuery, PaymentCreatePayload>("/payments");

export const listPayments = (q: PaymentListQuery) => api.list(q);
export const createPayment = (p: PaymentCreatePayload) => api.create(p);
export const updatePayment = (id: string, p: Partial<PaymentCreatePayload>) => api.update(id, p);
export const deletePayment = (id: string) => api.remove(id);
