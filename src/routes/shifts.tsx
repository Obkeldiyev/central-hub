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
      addLabel="Add shift"
      createConfig={{
        submitLabel: "Save shift",
        fields: [
          { name: "name", label: t("people.name"), required: true, placeholder: "Morning" },
          { name: "code", label: "Code", placeholder: "M1" },
          { name: "type", label: "Type", type: "select", defaultValue: "NORMAL", options: [
            { value: "NORMAL", label: "Normal" },
            { value: "FLEXIBLE", label: "Flexible" },
          ] },
          { name: "start_time", label: t("attendance.checkIn"), type: "time-select", required: true, defaultValue: "09:00" },
          { name: "end_time", label: t("attendance.checkOut"), type: "time-select", required: true, defaultValue: "18:00" },
          { name: "break_minutes", label: "Break minutes", type: "select", defaultValue: "60", options: [
            { value: "0", label: "No break" },
            { value: "30", label: "30 minutes" },
            { value: "45", label: "45 minutes" },
            { value: "60", label: "1 hour" },
            { value: "90", label: "1.5 hours" },
          ] },
        ],
      }}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "-" },
        { key: "type", label: t("devices.type"), render: (r) => r.shift_type || r.type || "-" },
        { key: "start", label: t("attendance.checkIn"), render: (r) => r.start_time || "-" },
        { key: "end", label: t("attendance.checkOut"), render: (r) => r.end_time || "-" },
      ]}
    />
  );
}
