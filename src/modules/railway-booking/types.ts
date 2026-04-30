export type Ref = { id: string; label: string } | null | undefined;

export type RailwayBookingRow = {
  id: string;
  referenceNumber: string;
  spacePurchased: string;
  costPaid: number;
  linkedBooking: Ref;
  linkedBookingId: string | null;
  date: string;
  notes: string;
  createdBy: Ref;
  createdAt: string;
  updatedAt: string;
};

export type RailwayBookingListQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export type RailwayBookingListResult = {
  data: RailwayBookingRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type RailwayBookingPayload = {
  referenceNumber: string;
  spacePurchased?: string;
  costPaid: number;
  linkedBookingId?: string;
  date: string;
  notes?: string;
};

export type RailwayBookingFormState = {
  referenceNumber: string;
  spacePurchased: string;
  costPaid: string;
  linkedBookingId: string;
  date: string;
  notes: string;
};
