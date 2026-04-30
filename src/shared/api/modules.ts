import { http } from "@/shared/api/http";
import type {
  ApiList,
  ApiSingle,
  RailwayBookingRow,
  WagonRow,
  InventoryRow,
  PaymentRow,
  LedgerRow,
} from "@/shared/types";

export const railwayBookingApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<RailwayBookingRow>>("/railway-bookings", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<RailwayBookingRow>>("/railway-bookings", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<RailwayBookingRow>>(`/railway-bookings/${id}`, data)
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/railway-bookings/${id}`);
  },
};

export const wagonApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<WagonRow>>("/wagons", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<WagonRow>>("/wagons", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<WagonRow>>(`/wagons/${id}`, data)
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/wagons/${id}`);
  },
};

export const inventoryApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<InventoryRow>>("/inventory", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<InventoryRow>>("/inventory", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<InventoryRow>>(`/inventory/${id}`, data)
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/inventory/${id}`);
  },
};

export const paymentApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<PaymentRow>>("/payments", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  create(data: Record<string, unknown>) {
    return http
      .post<ApiSingle<PaymentRow>>("/payments", data)
      .then((r) => r.data.data);
  },
  update(id: string, data: Record<string, unknown>) {
    return http
      .patch<ApiSingle<PaymentRow>>(`/payments/${id}`, data)
      .then((r) => r.data.data);
  },
  remove(id: string) {
    return http.delete(`/payments/${id}`);
  },
};

export const ledgerApi = {
  list(params?: Record<string, string | number | undefined>) {
    return http
      .get<ApiList<LedgerRow>>("/ledger", { params })
      .then((r) => ({ items: r.data.data, meta: r.data.meta }));
  },
  profitAndLoss(params?: Record<string, string>) {
    return http
      .get<{
        data: {
          revenue: number;
          cost: number;
          grossProfit: number;
          expenses: number;
          netProfit: number;
        };
      }>("/ledger/profit-and-loss", { params })
      .then((r) => r.data.data);
  },
  balanceSheet() {
    return http
      .get<{
        data: {
          assets: {
            cash: number;
            accountsReceivable: number;
            inventoryValue: number;
            total: number;
          };
          liabilities: { accountsPayable: number; total: number };
          netWorth: number;
        };
      }>("/ledger/balance-sheet")
      .then((r) => r.data.data);
  },
  outstanding() {
    return http
      .get<{
        data: {
          clientsOwing: {
            id: string;
            name: string;
            phone: string;
            email: string;
            outstandingBalance: number;
          }[];
        };
      }>("/ledger/outstanding")
      .then((r) => r.data.data);
  },
};
