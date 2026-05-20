import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  ClipboardCheck,
  BarChart3,
  Settings,
} from "lucide-react";

export type MenuItem = {
  label: string;
  to?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
};

export const MENU: MenuItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Parties", to: "/parties", icon: Users },
  {
    label: "Consignments",
    icon: Package,
    children: [
      { label: "All Consignments", to: "/consignments" },
      { label: "Daily Summary", to: "/consignments/daily-summary" },
      { label: "Loading List", to: "/consignments/loading-list" },
    ],
  },
  { label: "Payments", to: "/payments", icon: CreditCard },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "POD / Bilti", to: "/pods", icon: ClipboardCheck },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Daily Report", to: "/reports/daily" },
      { label: "Outstanding", to: "/reports/outstanding" },
      { label: "Station-wise", to: "/reports/station" },
      { label: "GST Summary", to: "/reports/gst" },
    ],
  },
  { label: "Settings", to: "/settings", icon: Settings },
];
