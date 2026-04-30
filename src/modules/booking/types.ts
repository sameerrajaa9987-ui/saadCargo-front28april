export type ParcelType = "General" | "Fragile" | "Perishable" | "Machinery";
export type BookingType = "Tender-based" | "Railway Parcel";
export type BookingStatus =
  | "pending"
  | "in_transit"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "partial" | "paid";

export type Ref = { id: string; label: string } | null | undefined;

export type BookingRow = {
  id: string;
  bookingId: string;
  client: Ref;
  sourceStation: string;
  destinationStation: string;
  parcelType: ParcelType;
  weightKg: number;
  bookingType: BookingType;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
  notes: string;
  railwayBooking: Ref;
  wagon: Ref;
  createdBy: Ref;
  createdAt: string;
  updatedAt: string;
};

export type BookingListQuery = {
  search?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  limit?: number;
};

export type BookingListResult = {
  data: BookingRow[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type BookingPayload = {
  clientId: string;
  sourceStation: string;
  destinationStation: string;
  parcelType: ParcelType;
  weightKg: number;
  bookingType: BookingType;
  costPrice: number;
  sellingPrice: number;
  notes?: string;
};

export type BookingFormState = {
  clientId: string;
  sourceStation: string;
  destinationStation: string;
  parcelType: ParcelType;
  weightKg: string;
  bookingType: BookingType;
  costPrice: string;
  sellingPrice: string;
  notes: string;
};
