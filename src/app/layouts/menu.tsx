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

export type MenuSection = {
  /** Small uppercase group heading (hidden when the rail is collapsed). */
  heading?: string;
  items: MenuItem[];
};

/** Grouped navigation (2026 rail pattern) — sections give the rail structure. */
const SECTIONS: MenuSection[] = [
  {
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Operations",
    items: [
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
      { label: "POD / Bilti", to: "/pods", icon: ClipboardCheck },
    ],
  },
  {
    heading: "Billing",
    items: [
      { label: "Payments", to: "/payments", icon: CreditCard },
      { label: "Invoices", to: "/invoices", icon: FileText },
    ],
  },
  {
    heading: "Insights",
    items: [
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
    ],
  },
  {
    heading: "Account",
    items: [{ label: "Settings", to: "/settings", icon: Settings }],
  },
];

/** Flat list (all items across sections) — kept for any consumers. */
export const MENU: MenuItem[] = SECTIONS.flatMap((s) => s.items);
export { SECTIONS };
