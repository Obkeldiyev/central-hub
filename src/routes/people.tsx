import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/people")({
  component: withShell(People),
});

function People() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("people.title")}
      subtitle={t("people.subtitle")}
      endpoint="/api/hikcentral/people"
      addLabel={t("people.add")}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => `${r.first_name || ""} ${r.last_name || r.second_name || ""}`.trim() || r.name || r.username || "—" },
        { key: "department", label: t("people.department"), render: (r) => r.department?.name || r.department_name || "—" },
        { key: "role", label: t("people.role"), render: (r) => r.role || r.position || "—" },
        { key: "status", label: t("people.status"), render: (r) => (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.is_active === false ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
            {r.is_active === false ? "Inactive" : "Active"}
          </span>
        ) },
      ]}
    />
  );
}
