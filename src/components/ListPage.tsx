import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, RefreshCw, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader, Card } from "@/components/ui-kit";
import { api } from "@/lib/api";

interface ListPageProps {
  title: string;
  subtitle?: string;
  endpoint: string;
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
  addLabel?: string;
}

export function ListPage({ title, subtitle, endpoint, columns, addLabel }: ListPageProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    api<any>(endpoint)
      .then((res) => {
        const data = res?.data?.items || res?.data || res?.items || res || [];
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [endpoint]);

  const filtered = rows.filter((r) =>
    !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <button onClick={load} className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-accent">
              <RefreshCw className="h-4 w-4" /> {t("common.refresh")}
            </button>
            {addLabel && (
              <button className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Plus className="h-4 w-4" /> {addLabel}
              </button>
            )}
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")}
            className="h-8 flex-1 bg-transparent text-sm focus:outline-none" />
        </div>

        {error && <div className="border-b bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">{t("common.loading")}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">{t("common.noData")}</td></tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row.id || i} className="border-t hover:bg-accent/40">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3">
                        {c.render ? c.render(row) : (row[c.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function withShell(Component: React.FC) {
  return () => (
    <RequireAuth>
      <AppLayout><Component /></AppLayout>
    </RequireAuth>
  );
}
