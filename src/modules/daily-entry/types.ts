export type Ref = { id: string; label: string } | null | undefined;

export type DailyEntryRow = {
  id: string;
  date: string;
  entryType: "booking" | "expense" | "payment";
  client: Ref;
  clientId: string | null;
  booking: Ref & { sourceStation?: string; destinationStation?: string };
  bookingId: string | null;
  description: string;
  amount: number;
  debit: number;
  credit: number;
  paymentMode?: "cash" | "bank" | "upi" | "cheque";
  paymentType?: "received" | "paid" | "expense";
  referenceNumber?: string;
  category?: string;
  notes?: string;
  createdBy: Ref;
  createdAt: string;
  updatedAt: string;
};

export type DailyEntryListQuery = {
  date?: string;
  entryType?: "booking" | "expense" | "payment";
  clientId?: string;
  page?: number;
  limit?: number;
};

export type DailyEntryListResult = {
  data: DailyEntryRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type DailyEntryPayload = {
  date?: string;
  entryType: "booking" | "expense" | "payment";
  clientId?: string;
  clientName?: string;
  bookingId?: string;
  description: string;
  amount: number;
  paymentMode?: "cash" | "bank" | "upi" | "cheque";
  paymentType?: "received" | "paid" | "expense";
  referenceNumber?: string;
  category?: string;
  notes?: string;
};

export type DailyEntryFormState = {
  date: string;
  entryType: "booking" | "expense" | "payment";
  clientId: string;
  bookingId: string;
  description: string;
  amount: string;
  paymentMode: "cash" | "bank" | "upi" | "cheque";
  paymentType: "received" | "paid" | "expense";
  referenceNumber: string;
  category: string;
  notes: string;
};
