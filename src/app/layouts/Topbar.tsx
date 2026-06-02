import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, Sun, UserCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/modules/auth/authSlice";
import { useTheme } from "@/app/theme";
import { useSidebar } from "./sidebarContext";

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { theme, toggleTheme } = useTheme();
  const { toggle: toggleSidebar, open: sidebarOpen } = useSidebar();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarOpen}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-foreground">{user?.name || "User"}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role || ""}</div>
          </div>
          <UserCircle2 className="h-8 w-8 text-primary/70" />
          <button
            onClick={() => {
              dispatch(clearAuth());
              navigate("/login", { replace: true });
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
