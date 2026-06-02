import { http } from "@/shared/api/http";
import { createResourceApi } from "@/modules/common/createResourceApi";
import type { Invoice, InvoiceListQuery, InvoiceCreatePayload } from "../types";

const api = createResourceApi<Invoice, InvoiceListQuery, InvoiceCreatePayload>("/invoices");

export const listInvoices = (q: InvoiceListQuery) => api.list(q);
export const createInvoice = (p: InvoiceCreatePayload) => api.create(p);
export const updateInvoice = (
  id: string,
  p: Partial<{ date: string; cgstRate: number; sgstRate: number; igstRate: number; notes: string }>,
) => api.update(id, p);
export const deleteInvoice = (id: string) => api.remove(id);

export async function finalizeInvoice(id: string) {
  const res = await http.post<{ data: Invoice }>(`/invoices/${id}/finalize`);
  return res.data.data;
}
export async function markPaidInvoice(id: string) {
  const res = await http.post<{ data: Invoice }>(`/invoices/${id}/mark-paid`);
  return res.data.data;
}
export async function cancelInvoice(id: string) {
  const res = await http.post<{ data: Invoice }>(`/invoices/${id}/cancel`);
  return res.data.data;
}
export const getInvoicePdfPath = (id: string): string => `/invoices/${id}/pdf`;
/** @deprecated Use openAuthenticatedPdf(getInvoicePdfPath(id)) instead — bare URL fails 401 (no auth header). */
export function getInvoicePdfUrl(id: string): string {
  return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/invoices/${id}/pdf`;
}
