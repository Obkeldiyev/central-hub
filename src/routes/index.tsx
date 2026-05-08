import { createFileRoute, Navigate } from "@tanstack/react-router";
import { getToken } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Navigate to={getToken() ? "/dashboard" : "/login"} />;
}
