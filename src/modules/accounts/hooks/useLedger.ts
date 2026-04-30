import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/modules/common/shared-crud/createResourceHooks";
import { createResourceApi } from "@/modules/common/shared-crud/createResourceApi";
import { http } from "@/shared/api/http";
import type {
  LedgerListQuery,
  LedgerListResult,
  PnlData,
  OutstandingRow,
  BalanceSheetData,
  LedgerRow,
} from "../types";

const ledgerApi = createResourceApi<LedgerRow, LedgerListQuery, LedgerRow>(
  "/ledger",
);

const ledgerCrud = createResourceHooks<
  LedgerListQuery,
  LedgerRow,
  { items: LedgerRow[]; meta: LedgerListResult["meta"] }
>("ledger", {
  list: ledgerApi.list,
  create: ledgerApi.create,
  update: ledgerApi.update,
  remove: ledgerApi.remove,
});

export const useLedger = ledgerCrud.useList;

export function useProfitLoss() {
  return useQuery({
    queryKey: ["profit-loss"],
    queryFn: async () => {
      const res = await http.get<{ data: PnlData }>("/ledger/profit-and-loss");
      return res.data.data;
    },
  });
}

export function useBalanceSheet() {
  return useQuery({
    queryKey: ["balance-sheet"],
    queryFn: async () => {
      const res = await http.get<{ data: BalanceSheetData }>(
        "/ledger/balance-sheet",
      );
      return res.data.data;
    },
  });
}

export function useOutstanding() {
  return useQuery({
    queryKey: ["outstanding"],
    queryFn: async () => {
      const res = await http.get<{ data: OutstandingRow[] }>(
        "/ledger/outstanding",
      );
      return res.data.data;
    },
  });
}
