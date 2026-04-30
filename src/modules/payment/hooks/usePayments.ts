import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  PaymentListQuery,
  PaymentListResult,
  PaymentPayload,
  PaymentRow,
} from "../types";

const paymentApi = createResourceApi<
  PaymentRow,
  PaymentListQuery,
  PaymentPayload
>("/payments");

const paymentCrud = createResourceHooks<
  PaymentListQuery,
  PaymentPayload,
  { items: PaymentRow[]; meta: PaymentListResult["meta"] }
>("payments", {
  list: paymentApi.list,
  create: paymentApi.create,
  update: paymentApi.update,
  remove: paymentApi.remove,
});

export const usePayments = paymentCrud.useList;
export const useCreatePayment = paymentCrud.useCreate;
export const useUpdatePayment = paymentCrud.useUpdate;
export const useDeletePayment = paymentCrud.useDelete;

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const res = await http.get<{ data: PaymentRow }>(`/payments/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
