const KEY = "hc_settings";

export interface AppSettings {
  companyName: string;
  logoUrl: string;
  bridgeToken: string;
}

const defaults: AppSettings = {
  companyName: "HikCentral Pro",
  logoUrl: "",
  bridgeToken: "",
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
}

export function saveSettings(s: Partial<AppSettings>) {
  const merged = { ...getSettings(), ...s };
  localStorage.setItem(KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("hc_settings_changed"));
  return merged;
}
