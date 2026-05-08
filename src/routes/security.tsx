import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/security")({
  component: withShell(Security),
});

function Security() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.security")}
      endpoint="/api/hikcentral/roles"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "permissions", label: "Permissions", render: (r) => r.permissions?.length ?? r._count?.permissions ?? "—" },
      ]}
    />
  );
}
