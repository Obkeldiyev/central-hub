import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ListPage, withShell } from "@/components/ListPage";

export const Route = createFileRoute("/people")({
  component: withShell(People),
});

function People() {
  const { t } = useTranslation();
  return (
    <ListPage
      title={t("people.title")}
      subtitle={t("people.subtitle")}
      endpoint="/api/hikcentral/people"
      addLabel={t("people.add")}
      pagination
      pageSize={20}
      createConfig={{
        endpoint: "/api/hikcentral/people/enroll",
        multipart: true,
        submitLabel: t("people.add"),
        fields: [
          { name: "id_number", label: "Person ID", required: true, placeholder: "EMP-001" },
          { name: "first_name", label: "First name", required: true },
          { name: "second_name", label: "Second name" },
          { name: "file", label: "Face photo", type: "file", required: true },
          { name: "device_ids", label: "Enroll on devices", type: "multiselect", required: true, optionEndpoint: "/api/hikcentral/devices", optionLabel: (row) => `${row.name} (${row.ip_address || "no IP"})`, optionValue: (row) => row.id },
        ],
        transform: (values) => ({
          full_name: `${values.first_name || ""} ${values.second_name || ""}`.trim(),
          id_number: values.id_number,
          device_ids: values.device_ids,
          file: values.file,
        }),
      }}
      columns={[
        { key: "name", label: t("people.name"), render: (r) => `${r.first_name || ""} ${r.last_name || r.second_name || ""}`.trim() || r.name || r.username || "-" },
        { key: "person_id", label: "Person ID", render: (r) => r.hikcentral_person_id || r.id_number || "-" },
        { key: "face", label: "Face ID", render: (r) => r.face_credentials?.[0]?.hikcentral_face_id || "-" },
        { key: "card", label: "Card", render: (r) => r.access_credentials?.find((c: any) => c.type === "CARD")?.value || "-" },
        { key: "role", label: t("people.role"), render: (r) => r.position || r.role || "-" },
        { key: "status", label: t("people.status"), render: (r) => (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.is_active === false ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
            {r.is_active === false ? "Inactive" : "Active"}
          </span>
        ) },
      ]}
    />
  );
}
