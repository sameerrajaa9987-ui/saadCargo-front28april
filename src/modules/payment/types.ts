export type Payment = {
  id: string;
  party: { id: string; name: string; mobile?: string } | string | null;
  date: string;
  amount: number;
  mode: "cash" | "bank_transfer" | "cheque" | "upi" | "other";
  referenceNumber?: string;
  notes?: string;
  receivedBy?: { id: string; name: string } | string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentListQuery = {
  party?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type PaymentListResult = {
  items: Payment[];
  meta: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    page: number;
    limit: number;
  };
};

export type PaymentCreatePayload = {
  party: string;
  date: string;
  amount: number;
  mode: string;
  referenceNumber?: string;
  notes?: string;
};
