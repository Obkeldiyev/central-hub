import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/tracking")({
  component: withShell(Tracking),
});

function Tracking() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.tracking")}
      endpoint="/api/hikcentral/tracking"
      columns={[
        { key: "subject", label: t("devices.type"), render: (r) => r.subject_type || "—" },
        { key: "name", label: t("people.name"), render: (r) => r.subject_name || r.name || "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
        { key: "updated", label: t("common.today"), render: (r) => r.updated_at ? new Date(r.updated_at).toLocaleString() : "—" },
      ]}
    />
  );
}
