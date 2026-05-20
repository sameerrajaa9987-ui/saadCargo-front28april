import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./app/layouts/AppLayout";
import { RequireAuth } from "./app/router/RequireAuth";
import { PageLoader } from "./shared/components/PageLoader";

const LoginPage = lazy(() => import("./modules/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("./modules/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const PartyListPage = lazy(() => import("./modules/party/pages/PartyListPage").then((m) => ({ default: m.PartyListPage })));
const ConsignmentListPage = lazy(() => import("./modules/consignment/pages/ConsignmentListPage").then((m) => ({ default: m.ConsignmentListPage })));
const DailySummaryPage = lazy(() => import("./modules/consignment/pages/DailySummaryPage").then((m) => ({ default: m.DailySummaryPage })));
const LoadingListPage = lazy(() => import("./modules/consignment/pages/LoadingListPage").then((m) => ({ default: m.LoadingListPage })));
const PaymentListPage = lazy(() => import("./modules/payment/pages/PaymentListPage").then((m) => ({ default: m.PaymentListPage })));
const InvoiceListPage = lazy(() => import("./modules/invoice/pages/InvoiceListPage").then((m) => ({ default: m.InvoiceListPage })));
const PodListPage = lazy(() => import("./modules/pod/pages/PodListPage").then((m) => ({ default: m.PodListPage })));
const DailyReportPage = lazy(() => import("./modules/reports/pages/DailyReportPage").then((m) => ({ default: m.DailyReportPage })));
const OutstandingReportPage = lazy(() => import("./modules/reports/pages/OutstandingReportPage").then((m) => ({ default: m.OutstandingReportPage })));
const StationReportPage = lazy(() => import("./modules/reports/pages/StationReportPage").then((m) => ({ default: m.StationReportPage })));
const GstReportPage = lazy(() => import("./modules/reports/pages/GstReportPage").then((m) => ({ default: m.GstReportPage })));
const SettingsPage = lazy(() => import("./modules/settings/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));

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
          <Route path="parties" element={<PartyListPage />} />
          <Route path="consignments" element={<ConsignmentListPage />} />
          <Route path="consignments/daily-summary" element={<DailySummaryPage />} />
          <Route path="consignments/loading-list" element={<LoadingListPage />} />
          <Route path="payments" element={<PaymentListPage />} />
          <Route path="invoices" element={<InvoiceListPage />} />
          <Route path="pods" element={<PodListPage />} />
          <Route path="reports/daily" element={<DailyReportPage />} />
          <Route path="reports/outstanding" element={<OutstandingReportPage />} />
          <Route path="reports/station" element={<StationReportPage />} />
          <Route path="reports/gst" element={<GstReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
