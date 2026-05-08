// Lightweight API client. Base URL is user-configurable from Settings.
const API_URL_KEY = "hc_api_url";
const TOKEN_KEY = "hc_token";
const USER_KEY = "hc_user";

export const DEFAULT_API_URL = "http://localhost:9000";

export function getApiUrl(): string {
  if (typeof window === "undefined") return DEFAULT_API_URL;
  return localStorage.getItem(API_URL_KEY) || DEFAULT_API_URL;
}
export function setApiUrl(url: string) {
  localStorage.setItem(API_URL_KEY, url.replace(/\/+$/, ""));
}
export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getUser(): { id?: string; username?: string; role?: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function setUser(u: any) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(msg: string, status = 0) { super(msg); this.status = status; }
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) || {}),
  };
  const tok = getToken();
  if (tok) headers["Authorization"] = `Bearer ${tok}`;
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (e: any) {
    throw new ApiError(e?.message || "Network error", 0);
  }
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText || "Request failed", res.status);
  }
  return data as T;
}

function safeJson(t: string) { try { return JSON.parse(t); } catch { return t; } }

export async function login(username: string, password: string) {
  // Backend likely exposes /api/hikcentral/auth/login or similar; try a couple of common paths.
  const candidates = ["/api/hikcentral/auth/login", "/api/auth/login", "/auth/login", "/login"];
  let lastErr: ApiError | null = null;
  for (const p of candidates) {
    try {
      const data = await api<any>(p, { method: "POST", body: JSON.stringify({ username, password }) });
      const token = data?.token || data?.data?.token || data?.accessToken;
      const user = data?.user || data?.data?.user || { username };
      if (token) {
        setToken(token);
        setUser(user);
        return { token, user };
      }
    } catch (e: any) {
      lastErr = e;
      if (e.status === 0) throw e; // network error → bail
      if (e.status && e.status !== 404) throw e;
    }
  }
  throw lastErr || new ApiError("Login endpoint not found", 404);
}

export function logout() {
  setToken(null);
  setUser(null);
}
