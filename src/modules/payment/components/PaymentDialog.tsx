import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/modules/common/FormDialog";
import { paymentSchema, type PaymentFormValues } from "../validations/payment.validation";
import { useCreatePayment, useUpdatePayment } from "../hooks/usePayments";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import type { Payment } from "../types";
import type { Party } from "@/modules/party/types";
import { partyId as toPartyId } from "@/shared/lib/partyDisplay";

const MODES = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
  { value: "upi", label: "UPI" },
  { value: "other", label: "Other" },
];

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: Payment | null;
  onSuccess: () => void;
  parties: Party[];
}

export function PaymentDialog({ open, onOpenChange, mode, value, onSuccess, parties }: Props) {
  const createM = useCreatePayment();
  const updateM = useUpdatePayment();
  const isPending = createM.isPending || updateM.isPending;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { party: "", date: new Date().toISOString().split("T")[0], amount: 0, mode: "cash", referenceNumber: "", notes: "" },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && value) {
        form.reset({
          party: toPartyId(value.party),
          date: new Date(value.date).toISOString().split("T")[0],
          amount: value.amount,
          mode: value.mode,
          referenceNumber: value.referenceNumber ?? "",
          notes: value.notes ?? "",
        });
      } else {
        form.reset({ party: "", date: new Date().toISOString().split("T")[0], amount: 0, mode: "cash", referenceNumber: "", notes: "" });
      }
    }
  }, [open, mode, value, form]);

  const { errors } = form.formState;

  async function onSubmit(data: PaymentFormValues) {
    try {
      const payload = { ...data, referenceNumber: data.referenceNumber || undefined, notes: data.notes || undefined };
      if (mode === "create") await createM.mutateAsync(payload);
      else if (value) await updateM.mutateAsync({ id: value.id, payload });
      toast.success(mode === "create" ? "Payment recorded" : "Payment updated");
      onOpenChange(false);
      onSuccess();
    } catch (err) { toast.error(getApiErrorMessage(err)); }
  }

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title={mode === "create" ? "Record Payment" : "Edit Payment"}
      onSubmit={form.handleSubmit(onSubmit)} isPending={isPending} submitLabel={mode === "create" ? "Record" : "Save"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Party" required error={errors.party?.message}>
            <select className={`${inputCls} cursor-pointer`} {...form.register("party")}>
              <option value="">Select party...</option>
              {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Date" required error={errors.date?.message}>
          <input type="date" className={inputCls} {...form.register("date")} />
        </Field>
        <Field label="Amount (₹)" required error={errors.amount?.message}>
          <input type="number" step="0.01" min={0} className={inputCls} {...form.register("amount")} />
        </Field>
        <Field label="Mode" required error={errors.mode?.message}>
          <select className={`${inputCls} cursor-pointer`} {...form.register("mode")}>
            {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </Field>
        <Field label="Reference / Cheque No." error={errors.referenceNumber?.message}>
          <input className={inputCls} placeholder="UTR, cheque number..." {...form.register("referenceNumber")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Notes" error={errors.notes?.message}>
            <input className={inputCls} {...form.register("notes")} />
          </Field>
        </div>
      </div>
    </FormDialog>
  );
}
