import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/access-control")({
  component: withShell(AccessControl),
});

function AccessControl() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.accessControl")}
      endpoint="/api/hikcentral/access-levels"
      addLabel="Add access rule"
      createConfig={{
        endpoint: "/api/hikcentral/access-levels",
        submitLabel: "Save access rule",
        fields: [
          { name: "name", label: t("people.name"), required: true, placeholder: "Main entrance staff access" },
          { name: "hikcentral_level_id", label: "Access level ID", placeholder: "AL-001" },
          { name: "status", label: t("people.status"), type: "select", defaultValue: "ACTIVE", options: [
            { value: "ACTIVE", label: "Active" },
            { value: "DISABLED", label: "Disabled" },
            { value: "EXPIRED", label: "Expired" },
          ] },
          { name: "user_ids", label: t("nav.people"), type: "multiselect", optionEndpoint: "/api/hikcentral/people", optionLabel: (row) => row.full_name || `${row.first_name || ""} ${row.second_name || ""}`.trim() || row.id_number },
          { name: "access_point_ids", label: t("nav.accessPoints"), type: "multiselect", optionEndpoint: "/api/hikcentral/access-points", optionLabel: (row) => `${row.name} (${row.device?.name || "point"})` },
          { name: "can_enter", label: "Can enter", type: "checkbox", defaultValue: "true" },
          { name: "can_exit", label: "Can exit", type: "checkbox", defaultValue: "true" },
        ],
        transform: (values) => ({
          name: values.name,
          hikcentral_level_id: values.hikcentral_level_id,
          status: values.status || "ACTIVE",
          user_ids: values.user_ids ? values.user_ids.split(",").filter(Boolean) : [],
          access_points: values.access_point_ids
            ? values.access_point_ids.split(",").filter(Boolean).map((access_point_id) => ({
                access_point_id,
                can_enter: values.can_enter !== "false",
                can_exit: values.can_exit !== "false",
              }))
            : [],
        }),
      }}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => r.name || "-" },
        { key: "status", label: t("people.status"), render: (r) => r.status || "-" },
        { key: "people", label: t("nav.people"), render: (r) => r.people?.length ?? 0 },
        { key: "points", label: t("nav.accessPoints"), render: (r) => r.access_points?.length ?? 0 },
      ]}
    />
  );
}
