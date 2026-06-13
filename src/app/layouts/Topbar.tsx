import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, Sun, ChevronDown, Settings as SettingsIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAuth } from "@/modules/auth/authSlice";
import { useTheme } from "@/app/theme";
import { useSidebar } from "./sidebarContext";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  staff: "Staff",
};

export function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { theme, toggleTheme } = useTheme();
  const { toggle: toggleSidebar, open: sidebarOpen } = useSidebar();
  const isDark = theme === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function logout() {
    dispatch(clearAuth());
    navigate("/login", { replace: true });
  }

  const initials = (user?.name || "U")
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b sc-glass">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarOpen}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex-1" />

        {/* Quick theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Avatar dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 transition-colors hover:bg-accent"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-foreground">
                {user?.name || "User"}
              </span>
              <span className="block text-[11px] leading-tight text-muted-foreground capitalize">
                {user?.role ? (ROLE_LABELS[user.role] ?? user.role) : ""}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-fade-in">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <MenuRow
                  icon={isDark ? Sun : Moon}
                  label={isDark ? "Light mode" : "Dark mode"}
                  onClick={toggleTheme}
                />
                <MenuRow
                  icon={SettingsIcon}
                  label="Settings"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/settings");
                  }}
                />
              </div>
              <div className="border-t border-border p-1.5">
                <MenuRow icon={LogOut} label="Log out" danger onClick={logout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-accent",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
