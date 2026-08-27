import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cpu, RefreshCw, ScanFace, Wifi, WifiOff } from "lucide-react";
import { ListPage, withShell } from "@/components/ListPage";
import { Card, StatCard } from "@/components/ui-kit";
import { api } from "@/lib/api";

export const Route = createFileRoute("/devices")({
  component: withShell(Devices),
});

function Devices() {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = () => {
    setLoading(true);
    api<any>("/api/hikcentral/devices")
      .then((res) => {
        const data = res?.data?.items || res?.data || res?.items || res || [];
        setDevices(Array.isArray(data) ? data : []);
      })
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadDevices, []);

  const stats = useMemo(() => {
    const online = devices.filter((device) => device.network_status === "ONLINE").length;
    const face = devices.filter((device) => (device.device_type || device.type) === "FACE_TERMINAL").length;
    return { total: devices.length, online, offline: devices.length - online, face };
  }, [devices]);

  const faceTerminals = devices.filter((device) => (device.device_type || device.type) === "FACE_TERMINAL");

  return (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Cpu} label="Available devices" value={loading ? "-" : stats.total} />
        <StatCard icon={Wifi} label="Connected" value={loading ? "-" : stats.online} />
        <StatCard icon={WifiOff} label="Not connected" value={loading ? "-" : stats.offline} />
        <StatCard icon={ScanFace} label="Face ID devices" value={loading ? "-" : stats.face} />
      </div>

      <Card className="mb-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div>
            <h2 className="font-semibold">Available Face ID devices</h2>
            <p className="text-sm text-muted-foreground">Face terminals stay visible here even when they are offline.</p>
          </div>
          <button onClick={loadDevices} className="grid h-9 w-9 place-items-center rounded-md border hover:bg-accent" aria-label="Refresh devices">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {faceTerminals.length === 0 ? (
            <div className="text-sm text-muted-foreground">No Face ID terminals registered yet.</div>
          ) : (
            faceTerminals.map((device) => {
              const online = device.network_status === "ONLINE";
              return (
                <div key={device.id || device.hikcentral_device_id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{device.name || device.device_name || "Face terminal"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{device.ip_address || device.device_address || "No IP address"}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                      {online ? "Connected" : "Available"}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{device.location || device.area?.name || "No location"}</div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <ListPage
        title={t("devices.title")}
        subtitle={t("devices.subtitle")}
        endpoint="/api/hikcentral/devices"
        addLabel={t("devices.add")}
        createConfig={{
          submitLabel: "Save device",
          fields: [
            { name: "name", label: t("people.name"), required: true, placeholder: "Main entrance terminal" },
            { name: "type", label: t("devices.type"), type: "select", defaultValue: "FACE_TERMINAL", options: [
              { value: "ACCESS_CONTROL", label: "Access control" },
              { value: "FACE_TERMINAL", label: "Face terminal" },
              { value: "CAMERA", label: "Camera" },
              { value: "DOOR", label: "Door" },
              { value: "UNKNOWN", label: "Unknown" },
            ] },
            { name: "ip_address", label: t("devices.ip"), required: true, placeholder: "192.168.1.64" },
            { name: "sdk_port", label: "SDK port", type: "number", defaultValue: "8000", required: true },
            { name: "sdk_username", label: "SDK username", defaultValue: "admin", required: true },
            { name: "sdk_password", label: "SDK password", type: "password", required: true },
            { name: "location", label: "Location", placeholder: "Gate A" },
          ],
        }}
        columns={[
          { key: "name", label: t("people.name"), render: (r) => r.name || r.device_name || "-" },
          { key: "type", label: t("devices.type"), render: (r) => r.device_type || r.type || "-" },
          { key: "ip", label: t("devices.ip"), render: (r) => r.ip_address || r.ip || "-" },
          { key: "location", label: "Location", render: (r) => r.location || r.area?.name || "-" },
          { key: "access_points", label: t("nav.accessPoints"), render: (r) => r.access_points?.length ?? 0 },
          { key: "status", label: t("people.status"), render: (r) => {
            const s = r.network_status || r.status || "OFFLINE";
            const online = s === "ONLINE";
            return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{online ? "CONNECTED" : s}</span>;
          } },
        ]}
      />
    </>
  );
}
