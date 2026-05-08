import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Users, Building2, MapPin, Cpu, Activity, ShieldAlert, Clock, KeyRound } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader, Card, StatCard } from "@/components/ui-kit";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <AppLayout><DashboardPage /></AppLayout>
    </RequireAuth>
  ),
});

function DashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api<any>("/api/hikcentral/dashboard")
      .then((res) => { if (!cancelled) setData(res?.data || res); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const d = data || {};

  return (
    <>
      <PageHeader title={t("dashboard.title")} subtitle={t("dashboard.overview")} />

      {error && (
        <Card className="mb-6 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label={t("dashboard.people")} value={loading ? "—" : (d.people ?? 0)} />
        <StatCard icon={Building2} label={t("dashboard.departments")} value={loading ? "—" : (d.departments ?? 0)} />
        <StatCard icon={MapPin} label={t("dashboard.areas")} value={loading ? "—" : (d.areas ?? 0)} />
        <StatCard icon={Cpu} label={t("dashboard.devices")} value={loading ? "—" : (d.devices?.total ?? 0)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label={t("dashboard.events")} value={loading ? "—" : (d.events ?? 0)} />
        <StatCard icon={ShieldAlert} label={t("dashboard.denied")} value={loading ? "—" : (d.deniedEvents ?? 0)} />
        <StatCard icon={Clock} label={t("dashboard.attendance")} value={loading ? "—" : (d.attendanceRecords ?? 0)} />
        <StatCard icon={KeyRound} label={t("dashboard.accessGroups")} value={loading ? "—" : (d.accessGroups ?? 0)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{t("dashboard.deviceStatus")}</h2>
            <span className="text-xs text-muted-foreground">{t("common.today")}</span>
          </div>
          <DeviceBars online={d.devices?.online ?? 0} offline={d.devices?.offline ?? 0} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold">{t("dashboard.recentEvents")}</h2>
          {loading ? (
            <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
          ) : (
            <ul className="space-y-3">
              {(Array.isArray(d.recentEvents) ? d.recentEvents : []).slice(0, 6).map((ev: any, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div>{ev.event_type || ev.type || "Event"}</div>
                    <div className="text-xs text-muted-foreground">{ev.event_time || ev.time || ""}</div>
                  </div>
                </li>
              ))}
              {(!d.recentEvents || d.recentEvents.length === 0) && (
                <li className="text-sm text-muted-foreground">{t("common.noData")}</li>
              )}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function DeviceBars({ online, offline }: { online: number; offline: number }) {
  const total = Math.max(1, online + offline);
  const onlinePct = (online / total) * 100;
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Online</span>
          <span className="font-medium">{online}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full" style={{ width: `${onlinePct}%`, background: "var(--gradient-primary)" }} />
        </div>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Offline</span>
          <span className="font-medium">{offline}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-muted-foreground/40" style={{ width: `${100 - onlinePct}%` }} />
        </div>
      </div>
    </div>
  );
}
