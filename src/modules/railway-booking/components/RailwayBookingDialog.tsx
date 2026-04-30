import { useState, useEffect } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateRailwayBooking,
  useUpdateRailwayBooking,
} from "@/modules/railway-booking/hooks/useRailwayBookings";
import { bookingApi } from "@/modules/booking/api";
import type {
  RailwayBookingRow,
  RailwayBookingPayload,
} from "@/modules/railway-booking/types";
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

interface RailwayBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: RailwayBookingRow | null;
  onSuccess: () => void;
}

export function RailwayBookingDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: RailwayBookingDialogProps) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [form, setForm] = useState({
    referenceNumber: "",
    spacePurchased: "",
    costPaid: "",
    linkedBookingId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const createMutation = useCreateRailwayBooking();
  const updateMutation = useUpdateRailwayBooking();

  async function loadBookings() {
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
        await loadBookings();
        if (mode === "edit" && value) {
          setForm({
            referenceNumber: value.referenceNumber,
            spacePurchased: value.spacePurchased || "",
            costPaid: String(value.costPaid),
            linkedBookingId:
              value.linkedBookingId || value.linkedBooking?.id || "",
            date: value.date,
            notes: value.notes || "",
          });
        } else {
          setForm({
            referenceNumber: "",
            spacePurchased: "",
            costPaid: "",
            linkedBookingId: "",
            date: new Date().toISOString().split("T")[0],
            notes: "",
          });
        }
      })();
    }
  }, [open, mode, value]);

  async function customSubmit() {
    const payload: RailwayBookingPayload = {
      referenceNumber: form.referenceNumber,
      spacePurchased: form.spacePurchased || undefined,
      costPaid: Number(form.costPaid),
      linkedBookingId: form.linkedBookingId || undefined,
      date: form.date,
      notes: form.notes || undefined,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  return (
    <ResourceDialog<
      RailwayBookingRow,
      {
        referenceNumber: string;
        spacePurchased: string;
        costPaid: number;
        linkedBookingId?: string;
        date: string;
        notes: string;
      },
      keyof RailwayBookingRow
    >
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="New Railway Booking"
      editTitle="Edit Railway Booking"
      dialogContentClassName="max-w-2xl"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={
        !form.referenceNumber || !form.costPaid || !form.date
      }
      submitLabelCreate="Create"
      submitLabelEdit="Save"
      renderBody={() => (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Reference Number *
              </label>
              <Input
                value={form.referenceNumber}
                onChange={(e) =>
                  setForm({ ...form, referenceNumber: e.target.value })
                }
                placeholder="Reference number"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Space Purchased
              </label>
              <Input
                value={form.spacePurchased}
                onChange={(e) =>
                  setForm({ ...form, spacePurchased: e.target.value })
                }
                placeholder="Space purchased"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Cost Paid (₨) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.costPaid}
                onChange={(e) => setForm({ ...form, costPaid: e.target.value })}
                placeholder="Cost paid"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Linked Booking
              </label>
              <Select
                value={form.linkedBookingId}
                onValueChange={(value) =>
                  setForm({ ...form, linkedBookingId: value ?? "" })
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
                Date *
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
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
