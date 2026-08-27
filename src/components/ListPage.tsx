import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, PageHeader } from "@/components/ui-kit";
import { api } from "@/lib/api";

type CreateField = {
  name: string;
  label: string;
  type?: "text" | "time" | "time-select" | "number" | "password" | "file" | "select" | "multiselect" | "checkbox";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  optionEndpoint?: string;
  optionLabel?: (row: any) => string;
  optionValue?: (row: any) => string;
};

interface ListPageProps {
  title: string;
  subtitle?: string;
  endpoint: string;
  columns: { key: string; label: string; render?: (row: any) => ReactNode }[];
  addLabel?: string;
  createConfig?: {
    endpoint?: string;
    submitLabel?: string;
    fields: CreateField[];
    transform?: (values: Record<string, string>) => any;
    multipart?: boolean;
  };
  pagination?: boolean;
  pageSize?: number;
}

export function ListPage({ title, subtitle, endpoint, columns, addLabel, createConfig, pagination = false, pageSize = 20 }: ListPageProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);
  const [remoteOptions, setRemoteOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const createConfigKey = createConfig
    ? `${createConfig.endpoint || endpoint}:${createConfig.fields.map((field) => `${field.name}:${field.defaultValue || ""}:${field.optionEndpoint || ""}`).join("|")}`
    : "";

  const initialFormValues = useMemo(() => {
    const values: Record<string, string> = {};
    createConfig?.fields.forEach((field) => {
      values[field.name] = field.defaultValue || "";
    });
    return values;
  }, [createConfigKey]);

  const load = () => {
    setLoading(true);
    setError(null);
    const query = pagination ? `?page=${page}&limit=${pageSize}${q ? `&search=${encodeURIComponent(q)}` : ""}` : "";
    api<any>(`${endpoint}${query}`)
      .then((res) => {
        const data = res?.data?.items || res?.data || res?.items || res || [];
        setRows(Array.isArray(data) ? data : []);
        setMeta(res?.meta || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [endpoint, pagination, page, pageSize, q]);

  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  useEffect(() => {
    createConfig?.fields.forEach((field) => {
      if (!field.optionEndpoint) return;
      api<any>(field.optionEndpoint)
        .then((res) => {
          const data = res?.data?.items || res?.data || res?.items || res || [];
          const options = Array.isArray(data)
            ? data.map((row) => ({
                value: field.optionValue ? field.optionValue(row) : row.id,
                label: field.optionLabel ? field.optionLabel(row) : row.name || row.full_name || row.username || row.id,
              }))
            : [];
          setRemoteOptions((current) => ({ ...current, [field.name]: options }));
        })
        .catch(() => setRemoteOptions((current) => ({ ...current, [field.name]: [] })));
    });
  }, [createConfigKey]);

  const filtered = rows.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  const openCreate = () => {
    setFormValues(initialFormValues);
    setShowCreate(true);
  };

  const submitCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!createConfig) return;

    setSaving(true);
    setError(null);
    try {
      const payload = createConfig.transform ? createConfig.transform(formValues) : formValues;
      let body: BodyInit;
      if (createConfig.multipart) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") form.append(key, value instanceof File ? value : String(value));
        });
        body = form;
      } else {
        body = JSON.stringify(payload);
      }
      await api<any>(createConfig.endpoint || endpoint, {
        method: "POST",
        body,
      });
      setShowCreate(false);
      setFormValues(initialFormValues);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const timeOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (const minute of [0, 15, 30, 45]) {
        const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        options.push({ value, label: value });
      }
    }
    return options;
  }, []);

  const fieldOptions = (field: CreateField) => {
    if (field.type === "time-select") return timeOptions;
    return field.options || remoteOptions[field.name] || [];
  };

  const toggleMultiValue = (field: CreateField, value: string) => {
    const selected = (formValues[field.name] || "").split(",").filter(Boolean);
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    setFormValues((current) => ({ ...current, [field.name]: next.join(",") }));
  };

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
            {addLabel && createConfig && (
              <button onClick={openCreate} className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Plus className="h-4 w-4" /> {addLabel}
              </button>
            )}
          </>
        }
      />

      {showCreate && createConfig && (
        <Card className="mb-4 p-4">
          <form onSubmit={submitCreate} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">{addLabel}</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="grid h-8 w-8 place-items-center rounded-md border hover:bg-accent" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {createConfig.fields.map((field) => (
                <label key={field.name} className="space-y-1.5 text-sm font-medium">
                  <span>{field.label}</span>
                  {field.type === "checkbox" ? (
                    <button
                      type="button"
                      onClick={() => setFormValues((current) => ({ ...current, [field.name]: current[field.name] === "true" ? "false" : "true" }))}
                      className={`h-10 rounded-md border px-3 text-left text-sm ${formValues[field.name] === "true" ? "bg-primary text-primary-foreground" : "bg-background"}`}
                    >
                      {formValues[field.name] === "true" ? "Enabled" : "Disabled"}
                    </button>
                  ) : field.type === "multiselect" ? (
                    <div className="min-h-10 rounded-md border bg-background p-2">
                      <div className="flex flex-wrap gap-2">
                        {fieldOptions(field).map((option) => {
                          const selected = (formValues[field.name] || "").split(",").includes(option.value);
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => toggleMultiValue(field, option.value)}
                              className={`rounded-md border px-2 py-1 text-xs ${selected ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : field.type === "select" || field.type === "time-select" ? (
                    <select
                      required={field.required}
                      value={formValues[field.name] || ""}
                      onChange={(event) => setFormValues((current) => ({ ...current, [field.name]: field.type === "file" ? event.target.files?.[0] : event.target.value }))}
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{field.placeholder || "Select"}</option>
                      {fieldOptions(field).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required={field.required}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={formValues[field.name] || ""}
                      onChange={(event) => setFormValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="h-9 rounded-md border px-3 text-sm hover:bg-accent">
                Cancel
              </button>
              <button disabled={saving} className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
                {saving ? t("common.loading") : createConfig.submitLabel || addLabel}
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b p-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.search")}
            className="h-8 flex-1 bg-transparent text-sm focus:outline-none"
          />
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
                        {c.render ? c.render(row) : (row[c.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {pagination && meta && meta.total > meta.limit && (
        <div className="flex items-center justify-between border-t px-1 pt-4 text-sm text-muted-foreground">
          <span>{(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-md border px-3 py-1.5 disabled:opacity-40">Previous</button>
            <button disabled={page * meta.limit >= meta.total} onClick={() => setPage((current) => current + 1)} className="rounded-md border px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
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
