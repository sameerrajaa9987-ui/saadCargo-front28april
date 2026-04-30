type Ref = { id: string; label: string } | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiList<T = any> = {
  data: T[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiSingle<T = any> = { data: T };

export type BookingRow = {
  id: string;
  bookingId: string;
  client: Ref;
  sourceStation: string;
  destinationStation: string;
  parcelType: string;
  weightKg: number;
  bookingType: string;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  status: string;
  paymentStatus: string;
  invoiceNumber: string;
  notes: string;
  railwayBooking: Ref;
  wagon: Ref;
  createdBy: Ref;
  createdAt: string;
  updatedAt: string;
};

export type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RailwayBookingRow = {
  id: string;
  referenceNumber: string;
  spacePurchased: string;
  costPaid: number;
  linkedBooking: Ref;
  date: string;
  notes: string;
  createdAt: string;
};

export type WagonRow = {
  id: string;
  wagonId: string;
  linkedBooking: Ref;
  departureStation: string;
  destinationStation: string;
  departureTime: string;
  expectedArrival: string;
  actualArrival: string;
  status: string;
  isDelayed: boolean;
  createdAt: string;
};

export type InventoryRow = {
  id: string;
  itemName: string;
  booking: Ref;
  quantity: number;
  unit: string;
  location: string;
  status: string;
  lastUpdated: string;
  createdAt: string;
};

export type PaymentRow = {
  id: string;
  type: string;
  clientOrVendorName: string;
  client: Ref;
  amount: number;
  mode: string;
  date: string;
  referenceNumber: string;
  linkedBooking: Ref;
  notes: string;
  createdBy: Ref;
  createdAt: string;
};

export type LedgerRow = {
  id: string;
  date: string;
  description: string;
  accountType: string;
  debit: number;
  credit: number;
  runningBalance: number;
  linkedEntityId: string | null;
  linkedEntityType: string | null;
  createdAt: string;
};
