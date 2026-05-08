import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Cpu, KeyRound, DoorOpen, Clock, Calendar,
  ClipboardList, CheckSquare, MapPin, FileBadge, Building2, Shield, RefreshCw, Settings, LogOut, Menu, X, Sun, Moon, Monitor, Globe,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { getUser, logout } from "@/lib/api";
import { getSettings } from "@/lib/settings";

const groups = (t: any) => [
  {
    label: "",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    ],
  },
  {
    label: t("nav.organization"),
    items: [
      { to: "/people", icon: Users, label: t("nav.people") },
      { to: "/organization", icon: Building2, label: t("nav.organization") },
    ],
  },
  {
    label: t("nav.devices"),
    items: [
      { to: "/devices", icon: Cpu, label: t("nav.devices") },
      { to: "/access-points", icon: DoorOpen, label: t("nav.accessPoints") },
      { to: "/access-control", icon: KeyRound, label: t("nav.accessControl") },
    ],
  },
  {
    label: t("nav.attendance"),
    items: [
      { to: "/attendance", icon: Clock, label: t("nav.attendance") },
      { to: "/shifts", icon: Calendar, label: t("nav.shifts") },
      { to: "/schedules", icon: ClipboardList, label: t("nav.schedules") },
      { to: "/approvals", icon: CheckSquare, label: t("nav.approvals") },
    ],
  },
  {
    label: "",
    items: [
      { to: "/tracking", icon: MapPin, label: t("nav.tracking") },
      { to: "/licenses", icon: FileBadge, label: t("nav.licenses") },
      { to: "/security", icon: Shield, label: t("nav.security") },
      { to: "/sync", icon: RefreshCw, label: t("nav.sync") },
      { to: "/settings", icon: Settings, label: t("nav.settings") },
    ],
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const user = getUser();

  useEffect(() => {
    const fn = () => setSettings(getSettings());
    window.addEventListener("hc_settings_changed", fn);
    return () => window.removeEventListener("hc_settings_changed", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const cycleTheme = () => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 lg:static lg:flex ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-md object-cover" />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-md" style={{ background: "var(--gradient-primary)" }}>
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{settings.companyName || t("app.name")}</div>
              <div className="truncate text-xs text-sidebar-foreground/60">{t("app.tagline")}</div>
            </div>
            <button className="ml-auto lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {groups(t).map((g, i) => (
              <div key={i} className="mb-4">
                {g.label && <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">{g.label}</div>}
                <ul className="space-y-1">
                  {g.items.map((item) => {
                    const active = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
                    return (
                      <li key={item.to}>
                        <Link to={item.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <button
              onClick={() => { logout(); navigate({ to: "/login" }); }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-4 w-4" /> {t("nav.logout")}
            </button>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex w-full min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="text-sm text-muted-foreground">{settings.companyName || t("app.name")}</div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={i18n.language?.slice(0,2) || "en"}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="h-9 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={t("settings.language")}
            >
              <option value="en">🇬🇧 EN</option>
              <option value="ru">🇷🇺 RU</option>
              <option value="uz">🇺🇿 UZ</option>
            </select>
            <button onClick={cycleTheme} className="grid h-9 w-9 place-items-center rounded-md border hover:bg-accent" aria-label="Theme">
              <ThemeIcon className="h-4 w-4" />
            </button>
            {user && (
              <div className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {(user.username || "U")[0].toUpperCase()}
                </div>
                <span className="hidden sm:block">{user.username}</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
