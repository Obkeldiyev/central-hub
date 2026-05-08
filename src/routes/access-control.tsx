import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/access-control")({
  component: withShell(AccessControl),
});

function AccessControl() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.accessControl")}
      endpoint="/api/hikcentral/access-groups"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
        { key: "people", label: t("nav.people"), render: (r) => r.people_count ?? r._count?.people ?? "—" },
      ]}
    />
  );
}
