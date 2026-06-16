"use client";

const POPUP_KEY = "upsctn-popup-state";

export type PopupType = "banner" | "storeDialog" | "exitIntent" | "topperExit";

export function getPopupState(): Partial<Record<PopupType, { shown?: string; dismissed?: string }>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(POPUP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markPopup(type: PopupType, action: "shown" | "dismissed") {
  if (typeof window === "undefined") return;
  try {
    const state = getPopupState();
    const today = new Date().toISOString().slice(0, 10);
    state[type] = { ...state[type], [action]: today };
    localStorage.setItem(POPUP_KEY, JSON.stringify(state));
  } catch {}
}

export function shouldSuppressPopups(): boolean {
  if (typeof window === "undefined") return false;
  const state = getPopupState();
  const today = new Date().toISOString().slice(0, 10);
  return Object.values(state).some((s) => s?.dismissed === today || s?.shown === today);
}

export function wasDismissedToday(type: PopupType): boolean {
  if (typeof window === "undefined") return false;
  const state = getPopupState();
  const today = new Date().toISOString().slice(0, 10);
  return state[type]?.dismissed === today;
}

export function wasShownToday(type: PopupType): boolean {
  if (typeof window === "undefined") return false;
  const state = getPopupState();
  const today = new Date().toISOString().slice(0, 10);
  return state[type]?.shown === today;
}
