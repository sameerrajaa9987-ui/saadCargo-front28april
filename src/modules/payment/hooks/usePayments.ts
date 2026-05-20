import { createResourceHooks } from "@/modules/common/createResourceHooks";
import { listPayments, createPayment, updatePayment, deletePayment } from "../api/paymentApi";
import type { PaymentListQuery, PaymentCreatePayload, PaymentListResult } from "../types";

const crud = createResourceHooks<PaymentListQuery, PaymentCreatePayload, PaymentListResult>(
  "payments",
  { list: listPayments, create: createPayment, update: updatePayment, remove: deletePayment }
);

export const usePayments = crud.useList;
export const useCreatePayment = crud.useCreate;
export const useUpdatePayment = crud.useUpdate;
export const useDeletePayment = crud.useDelete;
