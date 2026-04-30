export type WagonStatus = "pending" | "in_transit" | "arrived" | "delivered";

export type Ref = { id: string; label: string } | null | undefined;

export type WagonRow = {
  id: string;
  wagonId: string;
  linkedBooking: Ref;
  linkedBookingId: string | null;
  departureStation: string;
  destinationStation: string;
  departureTime: string;
  expectedArrival: string;
  actualArrival: string | null;
  status: WagonStatus;
  isDelayed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WagonListQuery = {
  search?: string;
  status?: WagonStatus;
  page?: number;
  limit?: number;
};

export type WagonListResult = {
  data: WagonRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type WagonPayload = {
  wagonId: string;
  linkedBookingId?: string;
  departureStation?: string;
  destinationStation?: string;
  departureTime: string;
  expectedArrival: string;
  actualArrival?: string;
  status?: WagonStatus;
};

export type WagonFormState = {
  wagonId: string;
  linkedBookingId: string;
  departureStation: string;
  destinationStation: string;
  departureTime: string;
  expectedArrival: string;
  actualArrival?: string;
  status: WagonStatus;
};
