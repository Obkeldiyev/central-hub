import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/devices")({
  component: withShell(Devices),
});

function Devices() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("devices.title")}
      subtitle={t("devices.subtitle")}
      endpoint="/api/hikcentral/devices"
      addLabel={t("devices.add")}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || r.device_name || "—" },
        { key: "type", label: t("devices.type"), render: (r) => r.device_type || r.type || "—" },
        { key: "model", label: t("devices.model"), render: (r) => r.model || "—" },
        { key: "ip", label: t("devices.ip"), render: (r) => r.ip_address || r.ip || "—" },
        { key: "status", label: t("people.status"), render: (r) => {
          const s = r.network_status || r.status || "OFFLINE";
          const online = s === "ONLINE";
          return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{s}</span>;
        } },
      ]}
    />
  );
}
