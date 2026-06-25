export const CONSIGNMENT_TYPES = [
  { value: "railway_booking", label: "Railway Booking" },
  { value: "own_bogie", label: "Own Bogie" },
  { value: "agent_handover", label: "Agent Handover" },
  { value: "agent_received", label: "Agent Received" },
];

export const PAYMENT_MODES = [
  { value: "paid_source", label: "Paid at Source" },
  { value: "to_pay", label: "To Pay" },
  { value: "on_bill", label: "On Bill (Credit)" },
  { value: "slip", label: "Slip" },
];

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "received", label: "Received" },
  { value: "settled", label: "Settled" },
];

export const PAYMENT_MODE_COLORS: Record<string, string> = {
  paid_source: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  to_pay: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  on_bill: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  slip: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  partial: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  received: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  settled: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};
