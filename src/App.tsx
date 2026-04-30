import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./app/layouts/AppLayout";
import { RequireAuth } from "./app/router/RequireAuth";
import { RequireRole } from "./app/router/RequireRole";
import { PageLoader } from "./shared/components/PageLoader";

const LoginPage = lazy(() =>
  import("./modules/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const DashboardPage = lazy(() =>
  import("./modules/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const DailyEntryPage = lazy(() =>
  import("./modules/daily-entry/pages/DailyEntryPage").then((m) => ({
    default: m.DailyEntryPage,
  })),
);
const BookingsPage = lazy(() =>
  import("./modules/booking/pages/BookingsPage").then((m) => ({
    default: m.BookingsPage,
  })),
);
const BookingDetailPage = lazy(() =>
  import("./modules/booking/pages/BookingDetailPage").then((m) => ({
    default: m.BookingDetailPage,
  })),
);
const PaymentsPage = lazy(() =>
  import("./modules/payment/pages/PaymentsPage").then((m) => ({
    default: m.PaymentsPage,
  })),
);
const RailwayBookingsPage = lazy(() =>
  import("./modules/railway-booking/pages/RailwayBookingsPage").then((m) => ({
    default: m.RailwayBookingsPage,
  })),
);
const WagonTrackingPage = lazy(() =>
  import("./modules/wagon/pages/WagonTrackingPage").then((m) => ({
    default: m.WagonTrackingPage,
  })),
);
const InventoryPage = lazy(() =>
  import("./modules/inventory/pages/InventoryPage").then((m) => ({
    default: m.InventoryPage,
  })),
);
const LedgerPage = lazy(() =>
  import("./modules/accounts/pages/LedgerPage").then((m) => ({
    default: m.LedgerPage,
  })),
);
const ProfitLossPage = lazy(() =>
  import("./modules/accounts/pages/ProfitLossPage").then((m) => ({
    default: m.ProfitLossPage,
  })),
);
const BalanceSheetPage = lazy(() =>
  import("./modules/accounts/pages/BalanceSheetPage").then((m) => ({
    default: m.BalanceSheetPage,
  })),
);
const OutstandingPage = lazy(() =>
  import("./modules/accounts/pages/OutstandingPage").then((m) => ({
    default: m.OutstandingPage,
  })),
);
const UsersPage = lazy(() =>
  import("./modules/settings/pages/UsersPage").then((m) => ({
    default: m.UsersPage,
  })),
);
const ClientsPage = lazy(() =>
  import("./modules/settings/pages/ClientsPage").then((m) => ({
    default: m.ClientsPage,
  })),
);
const ReportsPage = lazy(() =>
  import("./modules/reports/pages/ReportsPage").then((m) => ({
    default: m.ReportsPage,
  })),
);
const AuditLogPage = lazy(() =>
  import("./modules/audit-log/pages/AuditLogPage").then((m) => ({
    default: m.AuditLogPage,
  })),
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route
            path="daily-entry"
            element={
              <RequireRole roles={["admin", "operator"]}>
                <DailyEntryPage />
              </RequireRole>
            }
          />
          <Route
            path="bookings"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <BookingsPage />
              </RequireRole>
            }
          />
          <Route
            path="bookings/:id"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <BookingDetailPage />
              </RequireRole>
            }
          />
          <Route
            path="railway-bookings"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <RailwayBookingsPage />
              </RequireRole>
            }
          />
          <Route
            path="wagon-tracking"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <WagonTrackingPage />
              </RequireRole>
            }
          />
          <Route
            path="inventory"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <InventoryPage />
              </RequireRole>
            }
          />
          <Route
            path="payments"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <PaymentsPage />
              </RequireRole>
            }
          />
          <Route
            path="accounts/ledger"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <LedgerPage />
              </RequireRole>
            }
          />
          <Route
            path="accounts/profit-loss"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <ProfitLossPage />
              </RequireRole>
            }
          />
          <Route
            path="accounts/balance-sheet"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <BalanceSheetPage />
              </RequireRole>
            }
          />
          <Route
            path="accounts/outstanding"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <OutstandingPage />
              </RequireRole>
            }
          />
          <Route
            path="reports"
            element={
              <RequireRole roles={["admin", "operator", "accountant"]}>
                <ReportsPage />
              </RequireRole>
            }
          />
          <Route
            path="audit-logs"
            element={
              <RequireRole roles={["admin"]}>
                <AuditLogPage />
              </RequireRole>
            }
          />
          <Route
            path="settings/users"
            element={
              <RequireRole roles={["admin"]}>
                <UsersPage />
              </RequireRole>
            }
          />
          <Route
            path="settings/clients"
            element={
              <RequireRole roles={["admin"]}>
                <ClientsPage />
              </RequireRole>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
