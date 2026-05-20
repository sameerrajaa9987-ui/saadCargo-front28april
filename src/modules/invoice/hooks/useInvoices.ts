import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/createResourceHooks";
import { listInvoices, createInvoice, updateInvoice, deleteInvoice, finalizeInvoice, markPaidInvoice, cancelInvoice } from "../api/invoiceApi";
import type { InvoiceListQuery, InvoiceCreatePayload, InvoiceListResult } from "../types";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";

const crud = createResourceHooks<InvoiceListQuery, InvoiceCreatePayload, InvoiceListResult>(
  "invoices",
  { list: listInvoices, create: createInvoice, update: updateInvoice, remove: deleteInvoice }
);

export const useInvoices = crud.useList;
export const useCreateInvoice = crud.useCreate;
export const useUpdateInvoice = crud.useUpdate;
export const useDeleteInvoice = crud.useDelete;
export const INVOICE_KEYS = crud.KEYS;

export function useFinalizeInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: finalizeInvoice,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); toast.success("Invoice finalized"); },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useMarkPaidInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markPaidInvoice,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); toast.success("Invoice marked as paid"); },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useCancelInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelInvoice,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); toast.success("Invoice cancelled"); },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
