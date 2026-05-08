import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/licenses")({
  component: withShell(Licenses),
});

function Licenses() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.licenses")}
      endpoint="/api/hikcentral/licenses"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || r.license_key || "—" },
        { key: "feature", label: t("devices.type"), render: (r) => r.feature_code || "—" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "—" },
        { key: "expires", label: t("common.today"), render: (r) => r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—" },
      ]}
    />
  );
}
