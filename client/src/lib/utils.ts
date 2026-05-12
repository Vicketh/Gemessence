import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^(https?:\/\/|data:|blob:)/.test(url)) return url;
  const base = import.meta.env.BASE_URL || "/";
  if (url.startsWith("/")) {
    return `${base.replace(/\/$/, "")}${url}`;
  }
  return `${base}${url}`;
}

// API base URL for different environments
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Construct full API URL
export function apiUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (API_BASE_URL) {
    // Remote backend
    return `${API_BASE_URL}/${cleanPath}`;
  } else {
    // Local development or same-origin
    return `/${cleanPath}`;
  }
}
