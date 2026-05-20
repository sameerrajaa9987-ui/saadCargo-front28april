import { http } from "@/shared/api/http";
import { createResourceApi } from "@/modules/common/createResourceApi";
import type { Pod, PodListQuery, PodCreatePayload } from "../types";

const api = createResourceApi<Pod, PodListQuery, PodCreatePayload>("/pods");

export const listPods = (q: PodListQuery) => api.list(q);
export const createPod = (p: PodCreatePayload) => api.create(p);
export const updatePod = (id: string, p: Partial<PodCreatePayload>) => api.update(id, p);
export const deletePod = (id: string) => api.remove(id);

export async function updatePodStatus(id: string, deliveryStatus: string) {
  const res = await http.patch<{ data: Pod }>(`/pods/${id}/status`, { deliveryStatus });
  return res.data.data;
}

export const getPodPdfPath = (id: string): string => `/pods/${id}/pdf`;
/** @deprecated Use openAuthenticatedPdf(getPodPdfPath(id)) instead — bare URL fails 401 (no auth header). */
export function getPodPdfUrl(id: string): string {
  return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"}/pods/${id}/pdf`;
}
