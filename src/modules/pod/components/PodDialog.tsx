import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/modules/common/FormDialog";
import { podSchema, type PodFormValues } from "../validations/pod.validation";
import { useCreatePod, useUpdatePod } from "../hooks/usePods";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import type { Pod } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: Pod | null;
  onSuccess: () => void;
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function toDateInput(s?: string) {
  if (!s) return new Date().toISOString().split("T")[0];
  return new Date(s).toISOString().split("T")[0];
}

const DEFAULTS: PodFormValues = {
  date: new Date().toISOString().split("T")[0],
  consignorName: "",
  consignorMobile: "",
  consignorAddress: "",
  consigneeName: "",
  consigneeMobile: "",
  consigneeAddress: "",
  packages: 1,
  chargeableWeight: 0,
  contents: "",
  givenName: "",
  originStation: "MUM",
  destinationStation: "",
  paidAmount: 0,
  toPayAmount: 0,
  otherCharges: 0,
  railwayReceiptNumber: "",
  notes: "",
};

export function PodDialog({ open, onOpenChange, mode, value, onSuccess }: Props) {
  const createMutation = useCreatePod();
  const updateMutation = useUpdatePod();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<PodFormValues>({ resolver: zodResolver(podSchema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && value) {
        form.reset({
          date: toDateInput(value.date),
          consignorName: value.consignorName,
          consignorMobile: value.consignorMobile ?? "",
          consignorAddress: value.consignorAddress ?? "",
          consigneeName: value.consigneeName,
          consigneeMobile: value.consigneeMobile ?? "",
          consigneeAddress: value.consigneeAddress ?? "",
          packages: value.packages,
          actualWeight: value.actualWeight,
          chargeableWeight: value.chargeableWeight,
          contents: value.contents ?? "",
          givenName: value.givenName ?? "",
          originStation: value.originStation,
          destinationStation: value.destinationStation,
          paidAmount: value.paidAmount,
          toPayAmount: value.toPayAmount,
          otherCharges: value.otherCharges,
          railwayReceiptNumber: value.railwayReceiptNumber ?? "",
          notes: value.notes ?? "",
        });
      } else {
        form.reset(DEFAULTS);
      }
    }
  }, [open, mode, value, form]);

  const { errors } = form.formState;

  async function onSubmit(data: PodFormValues) {
    try {
      const payload = {
        ...data,
        consignorMobile: data.consignorMobile || undefined,
        consignorAddress: data.consignorAddress || undefined,
        consigneeMobile: data.consigneeMobile || undefined,
        consigneeAddress: data.consigneeAddress || undefined,
        contents: data.contents || undefined,
        givenName: data.givenName || undefined,
        railwayReceiptNumber: data.railwayReceiptNumber || undefined,
        notes: data.notes || undefined,
      };
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (value) {
        await updateMutation.mutateAsync({ id: value.id, payload });
      }
      toast.success(mode === "create" ? "Bilti created" : "Bilti updated");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "New Bilti (POD)" : `Edit Bilti #${value?.podNumber ?? ""}`}
      onSubmit={form.handleSubmit(onSubmit)}
      isPending={isPending}
      submitLabel={mode === "create" ? "Create Bilti" : "Save Changes"}
      size="xl"
    >
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Date" required error={errors.date?.message}>
            <input type="date" className={inputCls} {...form.register("date")} />
          </Field>
          <Field label="Origin Station" error={errors.originStation?.message}>
            <input className={inputCls} placeholder="MUM" {...form.register("originStation")} />
          </Field>
          <Field label="Destination Station" required error={errors.destinationStation?.message}>
            <input className={inputCls} placeholder="NDLS" {...form.register("destinationStation")} />
          </Field>
        </div>

        {/* Consignor */}
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Consignor (Sender)</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <Field label="Name" required error={errors.consignorName?.message}>
                <input className={inputCls} placeholder="Company / person name" {...form.register("consignorName")} />
              </Field>
            </div>
            <Field label="Mobile" error={errors.consignorMobile?.message}>
              <input className={inputCls} placeholder="9876543210" {...form.register("consignorMobile")} />
            </Field>
            <Field label="Address" error={errors.consignorAddress?.message}>
              <input className={inputCls} placeholder="Street address" {...form.register("consignorAddress")} />
            </Field>
          </div>
        </div>

        {/* Consignee */}
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Consignee (Receiver)</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <Field label="Name" required error={errors.consigneeName?.message}>
                <input className={inputCls} placeholder="Company / person name" {...form.register("consigneeName")} />
              </Field>
            </div>
            <Field label="Mobile" error={errors.consigneeMobile?.message}>
              <input className={inputCls} placeholder="9876543210" {...form.register("consigneeMobile")} />
            </Field>
            <Field label="Address" error={errors.consigneeAddress?.message}>
              <input className={inputCls} placeholder="Street address" {...form.register("consigneeAddress")} />
            </Field>
          </div>
        </div>

        {/* Parcel Details */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Packages" required error={errors.packages?.message}>
            <input type="number" min={1} className={inputCls} {...form.register("packages")} />
          </Field>
          <Field label="Actual Weight (kg)" error={errors.actualWeight?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("actualWeight")} />
          </Field>
          <Field label="Chargeable Weight (kg)" required error={errors.chargeableWeight?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("chargeableWeight")} />
          </Field>
          <Field label="Contents" error={errors.contents?.message}>
            <input className={inputCls} placeholder="Goods description" {...form.register("contents")} />
          </Field>
        </div>

        {/* Charges */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Paid Amount (₹)" error={errors.paidAmount?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("paidAmount")} />
          </Field>
          <Field label="To Pay Amount (₹)" error={errors.toPayAmount?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("toPayAmount")} />
          </Field>
          <Field label="Other Charges (₹)" error={errors.otherCharges?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("otherCharges")} />
          </Field>
          <Field label="RR / PR Number" error={errors.railwayReceiptNumber?.message}>
            <input className={inputCls} placeholder="Railway receipt no." {...form.register("railwayReceiptNumber")} />
          </Field>
        </div>

        {/* Misc */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Given To (Name)" error={errors.givenName?.message}>
            <input className={inputCls} placeholder="Person receiving at station" {...form.register("givenName")} />
          </Field>
          <Field label="Notes" error={errors.notes?.message}>
            <input className={inputCls} placeholder="Optional notes" {...form.register("notes")} />
          </Field>
        </div>
      </div>
    </FormDialog>
  );
}
