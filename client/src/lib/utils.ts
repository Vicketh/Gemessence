import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
