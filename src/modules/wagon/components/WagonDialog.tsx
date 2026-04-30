import { useState, useEffect } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateWagon,
  useUpdateWagon,
} from "@/modules/wagon/hooks/useWagons";
import { bookingApi } from "@/modules/booking/api";
import type {
  WagonRow,
  WagonStatus,
  WagonPayload,
} from "@/modules/wagon/types";
import type { BookingRow } from "@/shared/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WagonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: WagonRow | null;
  onSuccess: () => void;
}

export function WagonDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: WagonDialogProps) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [form, setForm] = useState({
    wagonId: "",
    linkedBookingId: "",
    departureStation: "",
    destinationStation: "",
    departureTime: "",
    expectedArrival: "",
    actualArrival: "",
    status: "pending" as WagonStatus,
  });

  const createMutation = useCreateWagon();
  const updateMutation = useUpdateWagon();

  async function loadBookings() {
    try {
      const b = await bookingApi.list({ limit: 100 });
      setBookings(b.items);
    } catch {
      // ignore
    }
  }

  async function handleBookingChange(bookingId: string) {
    setForm({ ...form, linkedBookingId: bookingId });
    const selectedBooking = bookings.find((b) => b.id === bookingId);
    if (selectedBooking) {
      setForm({
        ...form,
        linkedBookingId: bookingId,
        departureStation: selectedBooking.sourceStation,
        destinationStation: selectedBooking.destinationStation,
      });
    }
  }

  useEffect(() => {
    if (open) {
      (async () => {
        await loadBookings();
        if (mode === "edit" && value) {
          setForm({
            wagonId: value.wagonId,
            linkedBookingId: value.linkedBookingId || "",
            departureStation: value.departureStation,
            destinationStation: value.destinationStation,
            departureTime: value.departureTime || "",
            expectedArrival: value.expectedArrival || "",
            actualArrival: value.actualArrival || "",
            status: value.status,
          });
        } else {
          setForm({
            wagonId: "",
            linkedBookingId: "",
            departureStation: "",
            destinationStation: "",
            departureTime: "",
            expectedArrival: "",
            actualArrival: "",
            status: "pending" as WagonStatus,
          });
        }
      })();
    }
  }, [open, mode, value]);

  async function customSubmit() {
    if (mode === "create") {
      const payload: WagonPayload = {
        wagonId: form.wagonId,
        linkedBookingId: form.linkedBookingId || undefined,
        departureStation: form.departureStation || undefined,
        destinationStation: form.destinationStation || undefined,
        departureTime: form.departureTime || "",
        expectedArrival: form.expectedArrival || "",
        actualArrival: form.actualArrival || undefined,
        status: form.status,
      };
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      const payload: Partial<WagonPayload> = {};
      if (form.status) payload.status = form.status;
      if (form.departureTime) payload.departureTime = form.departureTime;
      if (form.expectedArrival) payload.expectedArrival = form.expectedArrival;
      if (form.actualArrival) payload.actualArrival = form.actualArrival;
      await updateMutation.mutateAsync({
        id: value.id,
        payload,
      });
    }
  }

  return (
    <ResourceDialog<WagonRow, Record<string, unknown>, keyof WagonRow>
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="Add Wagon"
      editTitle="Update Wagon"
      dialogContentClassName="max-w-2xl"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={
        mode === "create"
          ? !form.wagonId || !form.linkedBookingId
          : !form.status
      }
      submitLabelCreate="Create"
      submitLabelEdit="Update Status"
      renderBody={() => (
        <div className="space-y-4 py-2">
          {mode === "create" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Wagon / Train ID *
                </label>
                <Input
                  value={form.wagonId}
                  onChange={(e) =>
                    setForm({ ...form, wagonId: e.target.value })
                  }
                  placeholder="Wagon ID"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Linked Booking *
                </label>
                <Select
                  value={form.linkedBookingId}
                  onValueChange={handleBookingChange}
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
                  Departure Time
                </label>
                <Input
                  type="datetime-local"
                  value={form.departureTime}
                  onChange={(e) =>
                    setForm({ ...form, departureTime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Expected Arrival
                </label>
                <Input
                  type="datetime-local"
                  value={form.expectedArrival}
                  onChange={(e) =>
                    setForm({ ...form, expectedArrival: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Status *
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as WagonStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Actual Arrival
                </label>
                <Input
                  type="datetime-local"
                  value={form.actualArrival}
                  onChange={(e) =>
                    setForm({ ...form, actualArrival: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}
