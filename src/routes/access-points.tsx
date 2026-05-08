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
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "device", label: t("devices.title"), render: (r) => r.device?.name || r.device_id || "—" },
        { key: "type", label: t("devices.type"), render: (r) => r.type || "—" },
      ]}
    />
  );
}
