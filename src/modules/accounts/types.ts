export type LedgerRow = {
  id: string;
  date: string;
  description: string;
  accountType: "client" | "railway" | "expense" | "income" | "cash";
  debit: number;
  credit: number;
  balance: number;
  linkedEntityType: string | null;
  linkedEntityId: string | null;
  createdAt: string;
};

export type LedgerListQuery = {
  accountType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type LedgerListResult = {
  data: LedgerRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type PnlData = {
  revenue: number;
  cost: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
};

export type BalanceSheetRow = {
  account: string;
  debit: number;
  credit: number;
  balance: number;
};

export type BalanceSheetData = {
  assets: {
    cash: number;
    accountsReceivable: number;
    inventoryValue: number;
    total: number;
  };
  liabilities: {
    accountsPayable: number;
    total: number;
  };
  netWorth: number;
};

export type OutstandingRow = {
  clientId: string;
  clientName: string;
  totalOutstanding: number;
  lastPaymentDate: string | null;
};
