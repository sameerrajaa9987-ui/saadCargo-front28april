import { http } from "@/shared/api/http";
import type {
  LedgerListQuery,
  LedgerListResult,
  PnlData,
  BalanceSheetData,
  OutstandingRow,
} from "../types";

export const ledgerApi = {
  list(query: LedgerListQuery = {}) {
    return http
      .get<LedgerListResult>("/ledger", { params: query })
      .then((res) => ({
        items: res.data.data,
        meta: res.data.meta,
      }));
  },
  profitLoss() {
    return http
      .get<{ data: PnlData }>("/ledger/profit-and-loss")
      .then((res) => res.data.data);
  },
  balanceSheet() {
    return http
      .get<{ data: BalanceSheetData }>("/ledger/balance-sheet")
      .then((res) => res.data.data);
  },
  outstanding() {
    return http
      .get<{ data: OutstandingRow[] }>("/ledger/outstanding")
      .then((res) => res.data.data);
  },
};
