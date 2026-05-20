import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog } from "@/modules/common/FormDialog";
import { invoiceSchema, invoiceEditSchema, type InvoiceFormValues, type InvoiceEditFormValues } from "../validations/invoice.validation";
import { useCreateInvoice, useUpdateInvoice } from "../hooks/useInvoices";
import { useParties } from "@/modules/party/hooks/useParties";
import { useConsignments } from "@/modules/consignment/hooks/useConsignments";
import { INVOICE_MASTER_QUERIES } from "../constants/invoice.queries";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  value: Invoice | null;
  onSuccess: () => void;
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";
const selectCls = `${inputCls} cursor-pointer`;

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

// Create form (full fields including party + consignment selection)
function CreateForm({ onOpenChange, onSuccess }: { onOpenChange: (v: boolean) => void; onSuccess: () => void }) {
  const createMutation = useCreateInvoice();
  const partiesRes = useParties(INVOICE_MASTER_QUERIES.parties);
  const parties = partiesRes.data?.items ?? [];

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      party: "",
      date: new Date().toISOString().split("T")[0],
      consignmentIds: [],
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      notes: "",
    },
  });

  const selectedParty = form.watch("party");
  const selectedIds = form.watch("consignmentIds");

  const consignmentsRes = useConsignments(
    INVOICE_MASTER_QUERIES.onBillConsignments(selectedParty),
  );
  const allOnBill = consignmentsRes.data?.items ?? [];
  // Only show consignments not yet linked to any invoice
  const available = allOnBill.filter((c) => !c.invoice);

  function toggleConsignment(id: string) {
    const current = form.getValues("consignmentIds");
    if (current.includes(id)) {
      form.setValue("consignmentIds", current.filter((x) => x !== id), { shouldValidate: true });
    } else {
      form.setValue("consignmentIds", [...current, id], { shouldValidate: true });
    }
  }

  const { errors } = form.formState;

  async function onSubmit(data: InvoiceFormValues) {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Invoice created");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <FormDialog
      open={true}
      onOpenChange={onOpenChange}
      title="New GST Invoice"
      onSubmit={form.handleSubmit(onSubmit)}
      isPending={createMutation.isPending}
      submitLabel="Create Invoice"
      size="xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Field label="Party" required error={errors.party?.message}>
              <select className={selectCls} {...form.register("party")}>
                <option value="">Select party...</option>
                {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Date" required error={errors.date?.message}>
            <input type="date" className={inputCls} {...form.register("date")} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="CGST %" error={errors.cgstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("cgstRate")} />
          </Field>
          <Field label="SGST %" error={errors.sgstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("sgstRate")} />
          </Field>
          <Field label="IGST %" error={errors.igstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("igstRate")} />
          </Field>
        </div>

        {/* Consignment selection */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Select Consignments (on-bill, uninvoiced){errors.consignmentIds && <span className="text-destructive ml-2">{errors.consignmentIds.message}</span>}
          </p>
          {!selectedParty ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-center text-muted-foreground">Select a party to see available consignments</p>
          ) : consignmentsRes.isLoading ? (
            <div className="flex justify-center p-4"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : available.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-center text-muted-foreground">No uninvoiced on-bill consignments for this party</p>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-border bg-muted/40 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === available.length && available.length > 0}
                        onChange={() => {
                          if (selectedIds.length === available.length) {
                            form.setValue("consignmentIds", [], { shouldValidate: true });
                          } else {
                            form.setValue("consignmentIds", available.map((c) => c.id), { shouldValidate: true });
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Station</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Contents</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Freight (₹)</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {available.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => toggleConsignment(c.id)}
                      className={`cursor-pointer transition-colors hover:bg-muted/30 ${selectedIds.includes(c.id) ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={selectedIds.includes(c.id)} readOnly className="cursor-pointer" />
                      </td>
                      <td className="px-3 py-2">{formatDate(c.date)}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-primary">{c.destinationStation}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.contents ?? "—"}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(c.freightAmount)}</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatCurrency(c.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedIds.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">{selectedIds.length} consignment(s) selected</p>
          )}
        </div>

        <Field label="Notes" error={errors.notes?.message}>
          <input className={inputCls} placeholder="Optional notes" {...form.register("notes")} />
        </Field>
      </div>
    </FormDialog>
  );
}

// Edit form (draft only — only date, tax rates, notes editable)
function EditForm({ value, onOpenChange, onSuccess }: { value: Invoice; onOpenChange: (v: boolean) => void; onSuccess: () => void }) {
  const updateMutation = useUpdateInvoice();

  const form = useForm<InvoiceEditFormValues>({
    resolver: zodResolver(invoiceEditSchema),
    defaultValues: {
      date: toDateInput(value.date),
      cgstRate: value.cgstRate,
      sgstRate: value.sgstRate,
      igstRate: value.igstRate,
      notes: value.notes ?? "",
    },
  });

  const { errors } = form.formState;

  async function onSubmit(data: InvoiceEditFormValues) {
    try {
      await updateMutation.mutateAsync({ id: value.id, payload: data });
      toast.success("Invoice updated");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  return (
    <FormDialog
      open={true}
      onOpenChange={onOpenChange}
      title={`Edit Invoice ${value.billNumber}`}
      onSubmit={form.handleSubmit(onSubmit)}
      isPending={updateMutation.isPending}
      submitLabel="Save Changes"
      size="md"
    >
      <div className="space-y-4">
        <Field label="Date" required error={errors.date?.message}>
          <input type="date" className={inputCls} {...form.register("date")} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="CGST %" error={errors.cgstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("cgstRate")} />
          </Field>
          <Field label="SGST %" error={errors.sgstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("sgstRate")} />
          </Field>
          <Field label="IGST %" error={errors.igstRate?.message}>
            <input type="number" step="0.01" min={0} className={inputCls} {...form.register("igstRate")} />
          </Field>
        </div>
        <Field label="Notes" error={errors.notes?.message}>
          <input className={inputCls} placeholder="Optional notes" {...form.register("notes")} />
        </Field>
      </div>
    </FormDialog>
  );
}

export function InvoiceDialog({ open, onOpenChange, mode, value, onSuccess }: Props) {
  if (!open) return null;
  if (mode === "edit" && value) {
    return <EditForm value={value} onOpenChange={onOpenChange} onSuccess={onSuccess} />;
  }
  return <CreateForm onOpenChange={onOpenChange} onSuccess={onSuccess} />;
}
