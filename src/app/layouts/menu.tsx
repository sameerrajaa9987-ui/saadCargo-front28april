import {
  LayoutDashboard,
  Package,
  Train,
  Truck,
  Warehouse,
  CreditCard,
  BookOpen,
  BarChart3,
  Settings,
  CalendarDays,
  Shield,
} from "lucide-react";
import type { UserRole } from "@/modules/auth/types";

export type MenuItem = {
  label: string;
  to?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  roles?: UserRole[];
};

export const MENU: MenuItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Daily Entry",
    to: "/daily-entry",
    icon: CalendarDays,
    roles: ["admin", "operator"],
  },
  {
    label: "Bookings",
    to: "/bookings",
    icon: Package,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Railway Bookings",
    to: "/railway-bookings",
    icon: Train,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Wagon Tracking",
    to: "/wagon-tracking",
    icon: Truck,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Inventory",
    to: "/inventory",
    icon: Warehouse,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Payments",
    to: "/payments",
    icon: CreditCard,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Accounts",
    icon: BookOpen,
    roles: ["admin", "operator", "accountant"],
    children: [
      { label: "Ledger", to: "/accounts/ledger" },
      { label: "P&L Statement", to: "/accounts/profit-loss" },
      { label: "Balance Sheet", to: "/accounts/balance-sheet" },
      { label: "Outstanding", to: "/accounts/outstanding" },
    ],
  },
  {
    label: "Reports",
    to: "/reports",
    icon: BarChart3,
    roles: ["admin", "operator", "accountant"],
  },
  {
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
    children: [
      { label: "Manage Users", to: "/settings/users" },
      { label: "Manage Clients", to: "/settings/clients" },
      { label: "Audit Logs", to: "/audit-logs", icon: Shield },
    ],
  },
];
