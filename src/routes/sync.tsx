import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/sync")({
  component: withShell(Sync),
});

function Sync() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.sync")}
      endpoint="/api/hikcentral/sync/jobs"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || r.job_type || "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
        { key: "started", label: t("common.today"), render: (r) => r.started_at ? new Date(r.started_at).toLocaleString() : "—" },
      ]}
    />
  );
}
