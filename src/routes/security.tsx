import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

const moduleOptions = [
  "dashboard",
  "metadata",
  "organization",
  "people",
  "devices",
  "access-control",
  "attendance",
  "licenses",
  "tracking",
  "sync",
  "security",
].map((module) => ({ value: module, label: module }));

const actionOptions = ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE"].map((action) => ({ value: action, label: action }));

export const Route = createFileRoute("/security")({
  component: withShell(Security),
});

function Security() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("nav.security")}
      endpoint="/api/hikcentral/admins"
      addLabel="Create admin"
      createConfig={{
        endpoint: "/api/hikcentral/admins",
        submitLabel: "Save admin",
        fields: [
          { name: "username", label: "Username", required: true },
          { name: "password", label: "Password", type: "password", required: true },
          { name: "first_name", label: "First name", required: true },
          { name: "second_name", label: "Second name", required: true },
          { name: "role_name", label: "Access profile name", placeholder: "Gate operator" },
          { name: "modules", label: "Allowed modules", type: "multiselect", options: moduleOptions },
          { name: "actions", label: "Allowed actions", type: "multiselect", defaultValue: "READ", options: actionOptions },
        ],
        transform: (values) => ({
          ...values,
          modules: values.modules ? values.modules.split(",").filter(Boolean) : [],
          actions: values.actions ? values.actions.split(",").filter(Boolean) : ["READ"],
        }),
      }}
      columns={[
        { key: "username", label: "Username", render: (r) => r.username || "-" },
        { key: "name", label: t("people.name"), render: (r) => `${r.first_name || ""} ${r.second_name || ""}`.trim() || "-" },
        { key: "profiles", label: "Access profiles", render: (r) => r.role_assignments?.map((a: any) => a.role?.name).filter(Boolean).join(", ") || "-" },
        { key: "permissions", label: "Permissions", render: (r) => r.role_assignments?.reduce((sum: number, a: any) => sum + (a.role?.permissions?.length || 0), 0) ?? 0 },
      ]}
    />
  );
}
