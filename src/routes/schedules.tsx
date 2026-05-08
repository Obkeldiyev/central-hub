import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/schedules")({
  component: withShell(Schedules),
});

function Schedules() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.schedules")}
      endpoint="/api/hikcentral/attendance/schedule-templates"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "shift", label: t("nav.shifts"), render: (r) => r.shift?.name || "—" },
      ]}
    />
  );
}
