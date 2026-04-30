import { useState, useEffect } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateInventory,
  useUpdateInventory,
} from "@/modules/inventory/hooks/useInventory";
import { bookingApi } from "@/modules/booking/api";
import type {
  InventoryRow,
  InventoryUnit,
  InventoryStatus,
} from "@/modules/inventory/types";
import type { BookingRow } from "@/shared/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: InventoryRow | null;
  onSuccess: () => void;
}

export function InventoryDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: InventoryDialogProps) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [form, setForm] = useState({
    itemName: "",
    bookingId: "",
    quantity: "1",
    unit: "KG" as InventoryUnit,
    location: "",
    status: "warehouse" as InventoryStatus,
  });

  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();

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
            itemName: value.itemName,
            bookingId: value.bookingId || "",
            quantity: String(value.quantity),
            unit: value.unit,
            location: value.location || "",
            status: value.status,
          });
        } else {
          setForm({
            itemName: "",
            bookingId: "",
            quantity: "1",
            unit: "KG",
            location: "",
            status: "warehouse",
          });
        }
      })();
    }
  }, [open, mode, value]);

  async function customSubmit() {
    const payload = {
      itemName: form.itemName,
      bookingId: form.bookingId,
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location,
      status: form.status,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  return (
    <ResourceDialog<
      InventoryRow,
      {
        itemName: string;
        bookingId: string;
        quantity: number;
        unit: InventoryUnit;
        location: string;
        status: InventoryStatus;
      },
      keyof InventoryRow
    >
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="Add Inventory Item"
      editTitle="Edit Inventory Item"
      dialogContentClassName="max-w-2xl"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={!form.itemName}
      submitLabelCreate="Add Item"
      submitLabelEdit="Save"
      renderBody={() => (
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Item Name *
            </label>
            <Input
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="Item name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Quantity
              </label>
              <Input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="Quantity"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Unit
              </label>
              <Select
                value={form.unit}
                onValueChange={(value) =>
                  setForm({ ...form, unit: value as InventoryUnit })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="Pieces">Pieces</SelectItem>
                  <SelectItem value="Boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Location
              </label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Linked Booking
              </label>
              <Select
                value={form.bookingId}
                onValueChange={(value) =>
                  setForm({ ...form, bookingId: value ?? "" })
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
          </div>
        </div>
      )}
    />
  );
}
