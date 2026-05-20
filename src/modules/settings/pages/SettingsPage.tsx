import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/http";

type BusinessProfile = {
  businessName?: string;
  tagline?: string;
  gstin?: string;
  pan?: string;
  mobileNumbers?: string[];
  officeAddress?: string;
  godownAddress?: string;
  jurisdiction?: string;
  liabilityLimit?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankIFSC?: string;
  bankBranch?: string;
  defaultCgstRate?: number;
  defaultSgstRate?: number;
  billNumberPrefix?: string;
  useFinancialYearPrefix?: boolean;
  // Read-only counters surfaced for the user but never PATCHed
  nextBillNumber?: number;
  nextPodNumber?: number;
};

type ProfilePatch = Partial<Omit<BusinessProfile, "nextBillNumber" | "nextPodNumber">>;

async function getProfile(): Promise<BusinessProfile> {
  const res = await http.get<{ data: BusinessProfile }>("/business-profile");
  return res.data.data;
}

async function saveProfile(patch: ProfilePatch): Promise<BusinessProfile> {
  const res = await http.patch<{ data: BusinessProfile }>("/business-profile", patch);
  return res.data.data;
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["business-profile"], queryFn: getProfile });
  const [form, setForm] = useState<ProfilePatch>({});

  const mutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-profile"] });
      setForm({});
      toast.success("Profile saved");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const merged: BusinessProfile = { ...data, ...form };

  function setText<K extends keyof ProfilePatch>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value as ProfilePatch[K] }));
  }

  function setNumber<K extends keyof ProfilePatch>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setForm((f) => ({
        ...f,
        [key]: (v === "" ? undefined : Number(v)) as ProfilePatch[K],
      }));
    };
  }

  function setMobileAt(idx: number, value: string) {
    const current = (merged.mobileNumbers ?? []).slice();
    current[idx] = value;
    // Strip empty trailing entries on save (handled below)
    setForm((f) => ({ ...f, mobileNumbers: current }));
  }

  function addMobile() {
    const current = (merged.mobileNumbers ?? []).slice();
    if (current.length >= 4) return;
    current.push("");
    setForm((f) => ({ ...f, mobileNumbers: current }));
  }

  function removeMobile(idx: number) {
    const current = (merged.mobileNumbers ?? []).slice();
    current.splice(idx, 1);
    setForm((f) => ({ ...f, mobileNumbers: current }));
  }

  function handleSave() {
    const payload: ProfilePatch = { ...form };
    if (payload.mobileNumbers) {
      payload.mobileNumbers = payload.mobileNumbers.map((m) => m.trim()).filter(Boolean);
    }
    mutation.mutate(payload);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="erp-page max-w-3xl">
      <div>
        <h1 className="text-xl font-bold">Business Profile</h1>
        <p className="text-sm text-muted-foreground">Company details used in invoices and bilti PDFs</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        {/* Company */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Company Info</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Business Name">
                <input className={inputCls} value={merged.businessName ?? ""} onChange={setText("businessName")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Tagline">
                <input className={inputCls} value={merged.tagline ?? ""} onChange={setText("tagline")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Office Address">
                <input className={inputCls} value={merged.officeAddress ?? ""} onChange={setText("officeAddress")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Godown Address">
                <input className={inputCls} value={merged.godownAddress ?? ""} onChange={setText("godownAddress")} />
              </Field>
            </div>
            <Field label="Jurisdiction">
              <input className={inputCls} value={merged.jurisdiction ?? ""} onChange={setText("jurisdiction")} />
            </Field>
            <Field label="GSTIN">
              <input className={inputCls} value={merged.gstin ?? ""} onChange={setText("gstin")} />
            </Field>
            <Field label="PAN">
              <input className={inputCls} value={merged.pan ?? ""} onChange={setText("pan")} />
            </Field>
            <Field label="Liability Limit (₹)">
              <input type="number" className={inputCls} value={merged.liabilityLimit ?? ""} onChange={setNumber("liabilityLimit")} />
            </Field>
          </div>
        </div>

        {/* Mobile numbers (up to 4) */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Mobile Numbers</h2>
            <button
              type="button"
              onClick={addMobile}
              disabled={(merged.mobileNumbers?.length ?? 0) >= 4}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-40 disabled:no-underline"
            >
              + Add
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(merged.mobileNumbers ?? []).map((num, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className={inputCls}
                  value={num}
                  onChange={(e) => setMobileAt(idx, e.target.value)}
                  placeholder="9876543210"
                />
                <button
                  type="button"
                  onClick={() => removeMobile(idx)}
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {(merged.mobileNumbers?.length ?? 0) === 0 && (
              <p className="text-xs text-muted-foreground sm:col-span-2">No mobile numbers added yet.</p>
            )}
          </div>
        </div>

        {/* Bank Details */}
        <div className="border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Bank Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Bank Name">
              <input className={inputCls} value={merged.bankName ?? ""} onChange={setText("bankName")} />
            </Field>
            <Field label="Account Number">
              <input className={inputCls} value={merged.bankAccountNumber ?? ""} onChange={setText("bankAccountNumber")} />
            </Field>
            <Field label="IFSC Code">
              <input className={inputCls} value={merged.bankIFSC ?? ""} onChange={setText("bankIFSC")} />
            </Field>
            <Field label="Branch">
              <input className={inputCls} value={merged.bankBranch ?? ""} onChange={setText("bankBranch")} />
            </Field>
          </div>
        </div>

        {/* GST + bill numbering */}
        <div className="border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">GST &amp; Bill Numbering</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Default CGST %">
              <input type="number" step="0.01" className={inputCls} value={merged.defaultCgstRate ?? ""} onChange={setNumber("defaultCgstRate")} />
            </Field>
            <Field label="Default SGST %">
              <input type="number" step="0.01" className={inputCls} value={merged.defaultSgstRate ?? ""} onChange={setNumber("defaultSgstRate")} />
            </Field>
            <Field label="Bill Number Prefix">
              <input className={inputCls} value={merged.billNumberPrefix ?? ""} onChange={setText("billNumberPrefix")} placeholder='e.g. "SC/" or empty' />
            </Field>
            <Field label="Use Financial Year Prefix">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={merged.useFinancialYearPrefix ?? false}
                  onChange={(e) => setForm((f) => ({ ...f, useFinancialYearPrefix: e.target.checked }))}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-muted-foreground">Format bill numbers like 25-26/001</span>
              </label>
            </Field>
            <Field label="Next Bill Number (read-only)">
              <input className={`${inputCls} bg-muted`} value={merged.nextBillNumber ?? ""} disabled />
            </Field>
            <Field label="Next POD Number (read-only)">
              <input className={`${inputCls} bg-muted`} value={merged.nextPodNumber ?? ""} disabled />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={mutation.isPending || Object.keys(form).length === 0}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
