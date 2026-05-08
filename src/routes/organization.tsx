import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/organization")({
  component: withShell(Organization),
});

function Organization() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.organization")}
      endpoint="/api/hikcentral/departments"
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "—" },
        { key: "parent", label: "Parent", render: (r) => r.parent?.name || "—" },
        { key: "people", label: t("nav.people"), render: (r) => r._count?.people ?? "—" },
      ]}
    />
  );
}
