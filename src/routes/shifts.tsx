import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/shifts")({
  component: withShell(Shifts),
});

function Shifts() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.shifts")}
      endpoint="/api/hikcentral/attendance/shifts"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "type", label: t("devices.type"), render: (r) => r.shift_type || r.type || "—" },
        { key: "start", label: t("attendance.checkIn"), render: (r) => r.start_time || "—" },
        { key: "end", label: t("attendance.checkOut"), render: (r) => r.end_time || "—" },
      ]}
    />
  );
}
