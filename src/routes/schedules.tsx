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
      addLabel="Add routine"
      createConfig={{
        submitLabel: "Save routine",
        fields: [
          { name: "name", label: t("people.name"), required: true, placeholder: "Weekday routine" },
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
        transform: (values) => {
          const weekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
          return {
            name: values.name,
            type: values.type || "NORMAL",
            working_time: `${values.start_time}-${values.end_time}`,
            days: weekDays.map((week_day) => ({
              week_day,
              is_working_day: true,
              start_time: values.start_time,
              end_time: values.end_time,
              break_minutes: Number(values.break_minutes || 0),
            })),
          };
        },
      }}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "-" },
        { key: "time", label: "In / out", render: (r) => {
          const firstWorkingDay = r.days?.find((day: any) => day.is_working_day);
          return r.working_time || (firstWorkingDay ? `${firstWorkingDay.start_time} - ${firstWorkingDay.end_time}` : "-");
        } },
        { key: "type", label: "Type", render: (r) => r.type || "-" },
      ]}
    />
  );
}
