import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Loader2, Globe, Sun, Moon, Monitor } from "lucide-react";
import { login, getApiUrl, setApiUrl } from "@/lib/api";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiUrl, setApi] = useState(getApiUrl());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const cycleTheme = () => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setApiUrl(apiUrl);
    try {
      await login(username, password);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      if (err.status === 0) setError(t("auth.apiError"));
      else setError(err.message || t("auth.invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full blur-3xl" style={{ background: "var(--gradient-primary)", opacity: 0.35 }} />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl" style={{ background: "var(--gradient-primary)", opacity: 0.25 }} />
      </div>

      <div className="absolute right-4 top-4 flex gap-2">
        <select value={i18n.language?.slice(0,2) || "en"} onChange={(e) => i18n.changeLanguage(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
          <option value="en">🇬🇧 EN</option>
          <option value="ru">🇷🇺 RU</option>
          <option value="uz">🇺🇿 UZ</option>
        </select>
        <button onClick={cycleTheme} className="grid h-9 w-9 place-items-center rounded-md border hover:bg-accent">
          <ThemeIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="relative grid min-h-screen place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-xl shadow-lg" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("auth.welcome")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("auth.username")}</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("auth.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">{t("auth.backendUrl")}</summary>
                <input value={apiUrl} onChange={(e) => setApi(e.target.value)}
                  placeholder="http://localhost:9000"
                  className="mt-2 h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </details>

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-medium text-primary-foreground transition disabled:opacity-60"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("auth.signIn")}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("app.name")} · {t("app.tagline")}
          </p>
        </div>
      </div>
    </div>
  );
}
