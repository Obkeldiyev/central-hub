import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/access-points")({
  component: withShell(AccessPoints),
});

function AccessPoints() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.accessPoints")}
      endpoint="/api/hikcentral/access-points"
      addLabel="Add access point"
      createConfig={{
        submitLabel: "Save access point",
        fields: [
          { name: "name", label: t("people.name"), required: true, placeholder: "Main entrance IN" },
          { name: "hikcentral_point_id", label: "Access point ID", placeholder: "DOOR-001-IN" },
          { name: "device_id", label: t("devices.title"), type: "select", required: true, optionEndpoint: "/api/hikcentral/devices", optionLabel: (row) => `${row.name} (${row.ip_address || row.type || "device"})` },
          { name: "door_no", label: "Door number", placeholder: "1" },
          { name: "floor", label: "Floor" },
          { name: "location", label: "Location", placeholder: "Gate A" },
        ],
      }}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "-" },
        { key: "device", label: t("devices.title"), render: (r) => r.device?.name || r.device_id || "-" },
        { key: "door", label: "Door", render: (r) => r.door_no || "-" },
        { key: "location", label: "Location", render: (r) => r.location || "-" },
      ]}
    />
  );
}
