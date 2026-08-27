import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Sun, Moon, Monitor, Globe, Building2, RotateCcw, Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader, Card } from "@/components/ui-kit";
import { useTheme } from "@/lib/theme";
import { getSettings, saveSettings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RequireAuth>
      <AppLayout><SettingsPage /></AppLayout>
    </RequireAuth>
  ),
});

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const init = getSettings();
  const [companyName, setCompany] = useState(init.companyName);
  const [logoUrl, setLogo] = useState(init.logoUrl);
  const [bridgeToken, setBridge] = useState(init.bridgeToken);
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    saveSettings({ companyName, logoUrl, bridgeToken });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onReset = () => {
    setCompany("HikCentral Pro");
    setLogo("");
    setBridge("");
    setTheme("system");
    i18n.changeLanguage("en");
  };

  const Section = ({ icon: Icon, title, children }: any) => (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );

  const Field = ({ label, hint, children }: any) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  const themes: { value: "light" | "dark" | "system"; label: string; icon: any }[] = [
    { value: "light", label: t("settings.light"), icon: Sun },
    { value: "dark", label: t("settings.dark"), icon: Moon },
    { value: "system", label: t("settings.system"), icon: Monitor },
  ];

  const langs = [
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "ru", label: "Русский", flag: "🇷🇺" },
    { value: "uz", label: "Oʻzbekcha", flag: "🇺🇿" },
  ];

  return (
    <>
      <PageHeader
        title={t("settings.title")}
        actions={
          <>
            <button onClick={onReset} className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-accent">
              <RotateCcw className="h-4 w-4" /> {t("settings.reset")}
            </button>
            <button onClick={onSave} className="flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? t("settings.saved") : t("common.save")}
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={Building2} title={t("settings.general")}>
          <Field label={t("settings.company")}>
            <input value={companyName} onChange={(e) => setCompany(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </Field>
          <Field label={t("settings.logoUrl")}>
            <input value={logoUrl} onChange={(e) => setLogo(e.target.value)} placeholder="https://..."
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </Field>
          <Field label={t("settings.bridgeToken")}>
            <input type="password" value={bridgeToken} onChange={(e) => setBridge(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </Field>
        </Section>

        <Section icon={Globe} title={t("settings.language")}>
          <div className="grid grid-cols-3 gap-2">
            {langs.map((l) => {
              const active = (i18n.language || "en").startsWith(l.value);
              return (
                <button key={l.value} onClick={() => i18n.changeLanguage(l.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-sm transition ${active ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"}`}>
                  <span className="text-2xl">{l.flag}</span>
                  <span className="font-medium">{l.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section icon={Sun} title={t("settings.appearance")}>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((th) => {
              const active = theme === th.value;
              return (
                <button key={th.value} onClick={() => setTheme(th.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition ${active ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"}`}>
                  <th.icon className="h-5 w-5" />
                  <span className="font-medium">{th.label}</span>
                </button>
              );
            })}
          </div>
        </Section>
      </div>
    </>
  );
}
