import { useState } from "react";
import { ResourceDialog } from "@/modules/common/shared-crud/ResourceDialog";
import {
  useCreateBooking,
  useUpdateBooking,
} from "@/modules/booking/hooks/useBookings";
import { useClientsAll } from "@/modules/settings/hooks/useClients";
import type {
  BookingRow,
  BookingFormState,
  BookingType,
  ParcelType,
} from "@/modules/booking/types";
import { formatINR } from "@/shared/lib/utils";
import { Input, Textarea } from "@/shared/components/FormFields";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: BookingRow | null;
  onSuccess: () => void;
}

type ClientOption = { id: string; name: string };

export function BookingDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: BookingDialogProps) {
  const initialForm: BookingFormState =
    mode === "edit" && value
      ? {
          clientId: String(value.client?.id || ""),
          sourceStation: value.sourceStation,
          destinationStation: value.destinationStation,
          parcelType: value.parcelType,
          weightKg: String(value.weightKg),
          bookingType: value.bookingType,
          costPrice: String(value.costPrice),
          sellingPrice: String(value.sellingPrice),
          notes: value.notes || "",
        }
      : {
          clientId: "",
          sourceStation: "",
          destinationStation: "",
          parcelType: "General",
          weightKg: "",
          bookingType: "Railway Parcel",
          costPrice: "",
          sellingPrice: "",
          notes: "",
        };

  const { data: clientsData } = useClientsAll();
  const clients: ClientOption[] = (clientsData ?? []).map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const [form, setForm] = useState<BookingFormState>(initialForm);

  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();
  const selectedClientName = clients.find((c) => c.id === form.clientId)?.name;

  async function customSubmit() {
    const payload = {
      clientId: form.clientId,
      sourceStation: form.sourceStation,
      destinationStation: form.destinationStation,
      parcelType: form.parcelType,
      weightKg: Number(form.weightKg),
      bookingType: form.bookingType,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      notes: form.notes,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (value?.id) {
      await updateMutation.mutateAsync({ id: value.id, payload });
    }
  }

  if (!open) return null;

  return (
    <ResourceDialog<
      BookingRow,
      {
        clientId: string;
        sourceStation: string;
        destinationStation: string;
        parcelType: string;
        weightKg: number;
        bookingType: string;
        costPrice: number;
        sellingPrice: number;
        notes: string;
      },
      keyof BookingRow
    >
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      value={value}
      onSuccess={onSuccess}
      createTitle="New Booking"
      editTitle="Edit Booking"
      dialogContentClassName="max-w-2xl"
      customSubmit={customSubmit}
      customIsPending={createMutation.isPending || updateMutation.isPending}
      customDisableSubmit={
        !form.clientId ||
        !form.sourceStation ||
        !form.destinationStation ||
        !form.weightKg ||
        !form.costPrice ||
        !form.sellingPrice
      }
      submitLabelCreate="Create Booking"
      submitLabelEdit="Save Changes"
      renderBody={() => (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Client *
              </label>
              <ShadcnSelect
                value={form.clientId}
                onValueChange={(value) =>
                  setForm({ ...form, clientId: value || "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client">
                    {selectedClientName || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Booking Type
              </label>
              <ShadcnSelect
                value={form.bookingType}
                onValueChange={(value) =>
                  setForm({ ...form, bookingType: value as BookingType })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Railway Parcel">Railway Parcel</SelectItem>
                  <SelectItem value="Tender-based">Tender-based</SelectItem>
                </SelectContent>
              </ShadcnSelect>
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
                Parcel Type
              </label>
              <ShadcnSelect
                value={form.parcelType}
                onValueChange={(value) =>
                  setForm({ ...form, parcelType: value as ParcelType })
                }
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
              </ShadcnSelect>
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
                onChange={(e) =>
                  setForm({ ...form, costPrice: e.target.value })
                }
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
            <div className="rounded-lg bg-[hsl(var(--accent))] p-3 text-sm">
              <span className="text-[hsl(var(--muted-foreground))]">
                Auto-calculated Profit:{" "}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
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
        </div>
      )}
    />
  );
}
