import { useState, useEffect } from "react";
import { useCreateBooking } from "@/modules/booking/hooks/useBookings";
import { useClientsAll } from "@/modules/settings/hooks/useClients";
import { useCreatePayment } from "@/modules/payment/hooks/usePayments";
import { bookingApi } from "@/modules/booking/api";
import type { ParcelType, BookingType } from "@/modules/booking/types";
import type { PaymentMode, PaymentType } from "@/modules/payment/types";
import { toast } from "@/shared/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/shared/components/FormFields";
import { Package, CreditCard, Plus, DollarSign } from "lucide-react";
import { formatINR } from "@/shared/lib/utils";
import type { BookingRow } from "@/shared/types";

export function DailyEntryPage() {
  const [activeTab, setActiveTab] = useState<"booking" | "expense" | "payment">(
    "booking",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daily Entry</h1>
        <p className="text-sm text-muted-foreground">
          Quick data entry for operators
        </p>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("booking")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "booking"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4" /> New Booking
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "expense"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="h-4 w-4" /> Record Expense
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "payment"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="h-4 w-4" /> Record Payment
        </button>
      </div>

      <div className="max-w-4xl rounded-xl border border-border bg-card p-6 shadow-sm">
        {activeTab === "booking" ? (
          <QuickBookingForm />
        ) : activeTab === "expense" ? (
          <RecordExpenseForm />
        ) : (
          <QuickPaymentForm />
        )}
      </div>
    </div>
  );
}

function QuickBookingForm() {
  const [form, setForm] = useState({
    clientId: "",
    bookingType: "Railway Parcel",
    sourceStation: "",
    destinationStation: "",
    parcelType: "General",
    weightKg: "",
    costPrice: "",
    sellingPrice: "",
    notes: "",
  });
  const { data: clients } = useClientsAll();
  const [recentBookings, setRecentBookings] = useState<BookingRow[]>([]);
  const createMutation = useCreateBooking();
  const selectedClientName =
    clients?.find((client) => client.id === form.clientId)?.name || "";

  useEffect(() => {
    async function loadRecentBookings() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await bookingApi.list({
          dateFrom: today,
          limit: 5,
          sortBy: "createdAt",
          sortDir: "desc",
        });
        setRecentBookings(res.items);
      } catch {
        // ignore
      }
    }
    loadRecentBookings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...form,
        weightKg: Number(form.weightKg),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        bookingType: form.bookingType as BookingType,
        parcelType: form.parcelType as ParcelType,
      });
      toast.success("Booking created successfully!");
      setForm({
        clientId: "",
        bookingType: "Railway Parcel",
        sourceStation: "",
        destinationStation: "",
        parcelType: "General",
        weightKg: "",
        costPrice: "",
        sellingPrice: "",
        notes: "",
      });
      // Reload recent bookings
      const today = new Date().toISOString().split("T")[0];
      const res = await bookingApi.list({
        dateFrom: today,
        limit: 5,
        sortBy: "createdAt",
        sortDir: "desc",
      });
      setRecentBookings(res.items);
    } catch {
      toast.error("Failed to create booking");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Client *
            </label>
            <Select
              value={form.clientId}
              onValueChange={(value) => setForm({ ...form, clientId: value ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client">
                  {selectedClientName || undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(clients || []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Booking Type *
            </label>
            <Select
              value={form.bookingType}
              onValueChange={(value) =>
                setForm({ ...form, bookingType: value ?? "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tender-based">Tender-based</SelectItem>
                <SelectItem value="Railway Parcel">Railway Parcel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Parcel Type *
            </label>
            <Select
              value={form.parcelType}
              onValueChange={(value) => setForm({ ...form, parcelType: value ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Fragile">Fragile</SelectItem>
                <SelectItem value="Perishable">Perishable</SelectItem>
                <SelectItem value="Machinery">Machinery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Source Station *
            </label>
            <Input
              value={form.sourceStation}
              onChange={(e) =>
                setForm({ ...form, sourceStation: e.target.value })
              }
              placeholder="Source station"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Destination Station *
            </label>
            <Input
              value={form.destinationStation}
              onChange={(e) =>
                setForm({ ...form, destinationStation: e.target.value })
              }
              placeholder="Destination station"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Weight (KG) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
              placeholder="Weight"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Cost Price (₨) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              placeholder="Cost price"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Selling Price (₨) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: e.target.value })
              }
              placeholder="Selling price"
            />
          </div>
        </div>

        {form.costPrice && form.sellingPrice && (
          <div className="rounded-lg bg-accent p-3 text-sm">
            <span className="text-muted-foreground">Expected Profit: </span>
            <span
              className={`font-bold ${
                Number(form.sellingPrice) - Number(form.costPrice) > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : Number(form.sellingPrice) - Number(form.costPrice) < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-foreground"
              }`}
            >
              {formatINR(Number(form.sellingPrice) - Number(form.costPrice))}
            </span>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Notes
          </label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
          />
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Booking
          </Button>
        </div>
      </form>

      {recentBookings.length > 0 && (
        <div className="border-t border-border pt-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Last 5 Bookings Today
          </h3>
          <div className="rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/35">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">
                    Booking ID
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Client</th>
                  <th className="px-4 py-2 text-left font-medium">Route</th>
                  <th className="px-4 py-2 text-right font-medium">
                    Selling Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-2 font-mono text-primary">
                      {b.bookingId}
                    </td>
                    <td className="px-4 py-2">{b.client?.label || "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {b.sourceStation} → {b.destinationStation}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatINR(b.sellingPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RecordExpenseForm() {
  const [form, setForm] = useState({
    category: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    mode: "cash",
    referenceNumber: "",
    notes: "",
  });
  const createMutation = useCreatePayment();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        type: "expense" as PaymentType,
        clientOrVendorName: form.category,
        amount: Number(form.amount),
        mode: form.mode as PaymentMode,
        date: form.date,
        referenceNumber: form.referenceNumber,
        notes: `${form.description}. ${form.notes}`.trim(),
      });
      toast.success("Expense recorded successfully!");
      setForm({
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        mode: "cash",
        referenceNumber: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to record expense");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Expense Category *
          </label>
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value ?? "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Labour">Labour</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Railway Charge">Railway Charge</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Description *
          </label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Amount (₨) *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Date *
          </label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Payment Mode *
          </label>
          <Select
            value={form.mode}
            onValueChange={(value) => setForm({ ...form, mode: value ?? "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Reference Number
          </label>
          <Input
            value={form.referenceNumber}
            onChange={(e) =>
              setForm({ ...form, referenceNumber: e.target.value })
            }
            placeholder="Reference number"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">
          Notes
        </label>
        <Textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes"
        />
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full sm:w-auto"
        >
          <DollarSign className="mr-2 h-4 w-4" /> Record Expense
        </Button>
      </div>
    </form>
  );
}

function QuickPaymentForm() {
  const [form, setForm] = useState({
    paymentType: "received",
    clientOrVendorName: "",
    clientId: "",
    linkedBookingId: "",
    amount: "",
    mode: "cash",
    date: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(
    null,
  );
  const { data: clients } = useClientsAll();
  const createMutation = useCreatePayment();
  const selectedClientName =
    clients?.find((client) => client.id === form.clientId)?.name || "";

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await bookingApi.list({ search, limit: 5 });
      setBookings(res.items);
    } catch {
      toast.error("Error searching bookings");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        type: form.paymentType as PaymentType,
        clientOrVendorName: form.clientOrVendorName,
        clientId: form.clientId,
        linkedBookingId: form.linkedBookingId,
        amount: Number(form.amount),
        mode: form.mode as PaymentMode,
        date: form.date,
        referenceNumber: form.referenceNumber,
        notes: form.notes,
      });
      toast.success("Payment recorded successfully!");
      setForm({
        paymentType: "received",
        clientOrVendorName: "",
        clientId: "",
        linkedBookingId: "",
        amount: "",
        mode: "cash",
        date: new Date().toISOString().split("T")[0],
        referenceNumber: "",
        notes: "",
      });
      setSelectedBooking(null);
      setSearch("");
      setBookings([]);
    } catch {
      toast.error("Failed to record payment");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Payment Type *
            </label>
            <Select
              value={form.paymentType}
              onValueChange={(value) =>
                setForm({ ...form, paymentType: value ?? "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received">Received from Client</SelectItem>
                <SelectItem value="paid">Paid to Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              {form.paymentType === "received" ? "Client *" : "Vendor Name *"}
            </label>
            {form.paymentType === "received" ? (
              <Select
                value={form.clientId}
                onValueChange={(value) => {
                  const client = clients?.find((c) => c.id === value);
                  setForm({
                    ...form,
                    clientId: value ?? "",
                    clientOrVendorName: client?.name || "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client">
                    {selectedClientName || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(clients || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={form.clientOrVendorName}
                onChange={(e) =>
                  setForm({ ...form, clientOrVendorName: e.target.value })
                }
                placeholder="Vendor name"
              />
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Linked Booking (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search booking by ID..."
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleSearch}>
                Search
              </Button>
            </div>
            {selectedBooking && (
              <div className="mt-2 text-sm text-primary">
                Selected: {selectedBooking.bookingId} —{" "}
                {selectedBooking.paymentStatus}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Amount (₨) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Payment Mode *
            </label>
            <Select
              value={form.mode}
              onValueChange={(value) => setForm({ ...form, mode: value ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Date *
            </label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Reference Number
            </label>
            <Input
              value={form.referenceNumber}
              onChange={(e) =>
                setForm({ ...form, referenceNumber: e.target.value })
              }
              placeholder="Cheque/Txn ID"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Notes
          </label>
          <Textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notes"
          />
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full sm:w-auto"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Record Payment
          </Button>
        </div>
      </form>

      {bookings.length > 0 && !selectedBooking && (
        <div className="rounded-lg border border-border">
          {bookings.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBooking(b);
                setForm({ ...form, linkedBookingId: b.id });
              }}
              className="flex cursor-pointer items-center justify-between border-b border-border px-4 py-3 text-sm hover:bg-accent last:border-0"
            >
              <div>
                <div className="font-semibold text-primary">{b.bookingId}</div>
                <div className="text-muted-foreground">{b.client?.label}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">
                  {formatINR(b.sellingPrice)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {b.paymentStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
