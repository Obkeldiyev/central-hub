const TOKEN_KEY = "hc_token";
const USER_KEY = "hc_user";

export const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

export function getApiUrl(): string {
  return DEFAULT_API_URL.replace(/\/+$/, "");
}

export function setApiUrl(url: string) {
  void url;
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
  constructor(msg: string, status = 0) {
    super(msg);
    this.status = status;
  }
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = { ...((init.headers as Record<string, string>) || {}) };
  if (!(init.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const tok = getToken();
  if (tok) headers.Authorization = `Bearer ${tok}`;

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

function safeJson(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export async function login(username: string, password: string) {
  const data = await api<any>("/api/hikcentral/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return persistSession(data, username);
}

export async function getAuthStatus() {
  const data = await api<any>("/api/hikcentral/auth/status");
  return data?.data || data;
}

export async function setupFirstAdmin(payload: {
  username: string;
  password: string;
  first_name?: string;
  second_name?: string;
}) {
  const data = await api<any>("/api/hikcentral/auth/setup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return persistSession(data, payload.username);
}

function persistSession(data: any, username: string) {
  const token = data?.token || data?.data?.token || data?.accessToken;
  const user = data?.user || data?.data?.user || { username };
  if (token) {
    setToken(token);
    setUser(user);
    return { token, user };
  }
  throw new ApiError("Login response did not include a token", 500);
}

export function logout() {
  setToken(null);
  setUser(null);
}
