import { Navigate } from "@tanstack/react-router";
import { getToken } from "@/lib/api";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" />;
  return <>{children}</>;
}
