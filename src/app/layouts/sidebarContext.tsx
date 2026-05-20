import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Sidebar open/closed state.
 *
 * Two distinct UX modes are needed and we track them separately:
 *   - desktop (md+): "expanded" | "collapsed-to-icons"  → push layout
 *   - mobile (<md):  "drawer-open" | "drawer-closed"    → overlay
 *
 * One boolean covers both because their visual collapse maps to the same idea
 * ("less of the sidebar"). The CSS in <Sidebar/> handles each breakpoint.
 *
 * Persisted to localStorage so reload remembers the preference.
 */

type SidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);
const STORAGE_KEY = "saad_sidebar_open";

function readInitial(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  // Default: open on desktop, closed on mobile
  return window.matchMedia?.("(min-width: 768px)").matches ?? true;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState<boolean>(() => readInitial());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(open));
  }, [open]);

  const value: SidebarContextValue = {
    open,
    setOpen: setOpenState,
    toggle: () => setOpenState((v) => !v),
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}
