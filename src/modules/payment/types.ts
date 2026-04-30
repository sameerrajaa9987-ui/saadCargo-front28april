export type PaymentType = "received" | "paid" | "expense";
export type PaymentMode = "cash" | "bank" | "upi" | "cheque";

export type Ref = { id: string; label: string } | null | undefined;

export type PaymentRow = {
  id: string;
  type: PaymentType;
  clientOrVendorName: string;
  client: Ref;
  clientId: string | null;
  amount: number;
  mode: PaymentMode;
  date: string;
  referenceNumber: string | null;
  linkedBooking: Ref;
  linkedBookingId: string | null;
  notes: string;
  createdBy: Ref;
  createdAt: string;
  updatedAt: string;
};

export type PaymentListQuery = {
  search?: string;
  type?: PaymentType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type PaymentListResult = {
  data: PaymentRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type PaymentPayload = {
  type: PaymentType;
  clientOrVendorName: string;
  clientId?: string;
  amount: number;
  mode: PaymentMode;
  date: string;
  referenceNumber?: string;
  linkedBookingId?: string;
  notes?: string;
};

export type PaymentFormState = {
  type: PaymentType;
  clientOrVendorName: string;
  clientId: string;
  amount: string;
  mode: PaymentMode;
  date: string;
  referenceNumber: string;
  linkedBookingId: string;
  notes: string;
};
