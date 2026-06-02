import { http } from "@/shared/api/http";
import { createResourceApi } from "@/modules/common/createResourceApi";
import type { Consignment, ConsignmentListQuery, ConsignmentCreatePayload } from "../types";

const api = createResourceApi<Consignment, ConsignmentListQuery, ConsignmentCreatePayload>(
  "/consignments",
);

export const listConsignments = (query: ConsignmentListQuery) => api.list(query);
export const createConsignment = (payload: ConsignmentCreatePayload) => api.create(payload);
export const updateConsignment = (id: string, payload: Partial<ConsignmentCreatePayload>) =>
  api.update(id, payload);
export const deleteConsignment = (id: string) => api.remove(id);

export async function getDailySummary(date: string) {
  const res = await http.get<{ data: unknown }>(`/consignments/daily-summary/${date}`);
  return res.data.data;
}
