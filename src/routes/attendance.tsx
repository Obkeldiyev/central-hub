import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/attendance")({
  component: withShell(Attendance),
});

function Attendance() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("attendance.title")}
      subtitle={t("attendance.subtitle")}
      endpoint="/api/hikcentral/attendance/records"
      columns={[
        { key: "person", label: t("nav.people"), render: (r) => r.person?.first_name ? `${r.person.first_name} ${r.person.second_name || ""}` : (r.person_id || "—") },
        { key: "work_date", label: t("attendance.workDate"), render: (r) => r.work_date ? new Date(r.work_date).toLocaleDateString() : "—" },
        { key: "check_in", label: t("attendance.checkIn"), render: (r) => r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString() : "—" },
        { key: "check_out", label: t("attendance.checkOut"), render: (r) => r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString() : "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
      ]}
    />
  );
}
