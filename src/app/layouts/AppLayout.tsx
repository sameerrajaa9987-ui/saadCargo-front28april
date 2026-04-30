import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PageLoader } from "@/shared/components/PageLoader";

export function AppLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-w-0 bg-background/80">
        <Topbar />
        <main className="min-w-0 flex-1 p-4">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
