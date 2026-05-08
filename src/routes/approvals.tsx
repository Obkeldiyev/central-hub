import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/approvals")({
  component: withShell(Approvals),
});

function Approvals() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.approvals")}
      endpoint="/api/hikcentral/attendance/approval-requests"
      columns={[
        { key: "type", label: t("devices.type"), render: (r) => r.type || "—" },
        { key: "person", label: t("nav.people"), render: (r) => r.person?.first_name || r.requester_id || "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
        { key: "created", label: t("common.today"), render: (r) => r.created_at ? new Date(r.created_at).toLocaleString() : "—" },
      ]}
    />
  );
}
