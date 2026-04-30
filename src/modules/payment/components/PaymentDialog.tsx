import { useState, useEffect } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreatePayment,
  useUpdatePayment,
} from "@/modules/payment/hooks/usePayments";
import { clientApi } from "@/modules/settings/api/clientApi";
import { bookingApi } from "@/modules/booking/api";
import type {
  PaymentRow,
  PaymentType,
  PaymentMode,
  PaymentPayload,
} from "@/modules/payment/types";
import type { BookingRow } from "@/shared/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/shared/components/FormFields";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: PaymentRow | null;
  onSuccess: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: PaymentDialogProps) {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [form, setForm] = useState({
    type: "received" as PaymentType,
    clientOrVendorName: "",
    clientId: "",
    amount: "",
    mode: "cash" as PaymentMode,
    date: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    linkedBookingId: "",
    notes: "",
  });

  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();

  async function loadDropdowns() {
    try {
      const c = await clientApi.listAll();
      setClients(c);
    } catch {
      // ignore
    }
    try {
      const b = await bookingApi.list({ limit: 100 });
      setBookings(b.items);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (open) {
      (async () => {
        await loadDropdowns();
        if (mode === "edit" && value) {
          setForm({
            type: value.type,
            clientOrVendorName: value.clientOrVendorName,
            clientId: value.clientId || "",
            amount: String(value.amount),
            mode: value.mode,
            date: value.date,
            referenceNumber: value.referenceNumber || "",
            linkedBookingId:
              value.linkedBookingId || value.linkedBooking?.id || "",
            notes: value.notes || "",
          });
        } else {
          setForm({
            type: "received",
            clientOrVendorName: "",
            clientId: "",
            amount: "",
            mode: "cash",
            date: new Date().toISOString().split("T")[0],
            referenceNumber: "",
            linkedBookingId: "",
            notes: "",
          });
        }
      })();
    }
  }, [open, mode, value]);

  async function customSubmit() {
    const payload: PaymentPayload = {
      type: form.type,
      clientOrVendorName: form.clientOrVendorName,
      clientId: form.clientId || undefined,
      amount: Number(form.amount),
      mode: form.mode,
      date: form.date,
      referenceNumber: form.referenceNumber || undefined,
      linkedBookingId: form.linkedBookingId || undefined,
      notes: form.notes || undefined,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  return (
    <ResourceDialog<PaymentRow, Record<string, unknown>, keyof PaymentRow>
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="Record Payment"
      editTitle="Edit Payment"
      dialogContentClassName="max-w-2xl"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={!form.clientOrVendorName || !form.amount}
      submitLabelCreate="Record Payment"
      submitLabelEdit="Save"
      renderBody={() => (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Type *
              </label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm({ ...form, type: value as PaymentType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">
                    Received (Client Pays Us)
                  </SelectItem>
                  <SelectItem value="paid">
                    Paid (We Pay Railway/Vendor)
                  </SelectItem>
                  <SelectItem value="expense">
                    Expense (Operational Cost)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Client / Vendor Name *
              </label>
              <Input
                value={form.clientOrVendorName}
                onChange={(e) =>
                  setForm({ ...form, clientOrVendorName: e.target.value })
                }
                placeholder="Name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Linked Client
              </label>
              <Select
                value={form.clientId}
                onValueChange={(value) => setForm({ ...form, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Linked Booking
              </label>
              <Select
                value={form.linkedBookingId}
                onValueChange={(value) =>
                  setForm({ ...form, linkedBookingId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.bookingId} — {b.client?.label || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Mode *
              </label>
              <Select
                value={form.mode}
                onValueChange={(value) =>
                  setForm({ ...form, mode: value as PaymentMode })
                }
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
                placeholder="Reference"
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
        </div>
      )}
    />
  );
}
