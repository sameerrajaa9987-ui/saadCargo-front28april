import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/modules/common/FormDialog";
import { partySchema, type PartyFormValues } from "../validations/party.validation";
import { useCreateParty, useUpdateParty } from "../hooks/useParties";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import type { Party } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: Party | null;
  onSuccess: () => void;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

export function PartyDialog({ open, onOpenChange, mode, value, onSuccess }: Props) {
  const createMutation = useCreateParty();
  const updateMutation = useUpdateParty();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: { name: "", mobile: "", email: "", address: "", city: "", state: "", gstin: "", pan: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset(mode === "edit" && value ? {
        name: value.name,
        mobile: value.mobile ?? "",
        email: value.email ?? "",
        address: value.address ?? "",
        city: value.city ?? "",
        state: value.state ?? "",
        gstin: value.gstin ?? "",
        pan: value.pan ?? "",
      } : { name: "", mobile: "", email: "", address: "", city: "", state: "", gstin: "", pan: "" });
    }
  }, [open, mode, value, form]);

  const { errors } = form.formState;

  async function onSubmit(data: PartyFormValues) {
    try {
      const payload = { ...data, email: data.email || undefined };
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (value) {
        await updateMutation.mutateAsync({ id: value.id, payload });
      }
      toast.success(mode === "create" ? "Party created" : "Party updated");
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
      title={mode === "create" ? "New Party" : "Edit Party"}
      onSubmit={form.handleSubmit(onSubmit)}
      isPending={isPending}
      submitLabel={mode === "create" ? "Create Party" : "Save Changes"}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Party Name *" error={errors.name?.message}>
            <input className={inputCls} placeholder="e.g. ABC Traders" {...form.register("name")} />
          </Field>
        </div>
        <Field label="Mobile" error={errors.mobile?.message}>
          <input className={inputCls} placeholder="9876543210" {...form.register("mobile")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className={inputCls} placeholder="party@email.com" {...form.register("email")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address" error={errors.address?.message}>
            <input className={inputCls} placeholder="Street address" {...form.register("address")} />
          </Field>
        </div>
        <Field label="City" error={errors.city?.message}>
          <input className={inputCls} placeholder="Delhi" {...form.register("city")} />
        </Field>
        <Field label="State" error={errors.state?.message}>
          <input className={inputCls} placeholder="Delhi" {...form.register("state")} />
        </Field>
        <Field label="GSTIN" error={errors.gstin?.message}>
          <input className={inputCls} placeholder="27AAAAA0000A1Z5" {...form.register("gstin")} />
        </Field>
        <Field label="PAN" error={errors.pan?.message}>
          <input className={inputCls} placeholder="AAAAA0000A" {...form.register("pan")} />
        </Field>
      </div>
    </FormDialog>
  );
}
