import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Validate URL is a relative path, same-origin, or the configured API backend
const API_ORIGIN = (() => {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) return null;
  try { return new URL(base).origin; } catch { return null; }
})();

function validateUrl(url: string): string {
  if (url.startsWith("/") || url.startsWith("./")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.origin === window.location.origin) return url;
    if (API_ORIGIN && parsed.origin === API_ORIGIN) return url;
    throw new Error(`Disallowed URL origin: ${parsed.origin}`);
  } catch (e: any) {
    if (e.message.startsWith("Disallowed")) throw e;
    throw new Error(`Invalid URL: ${url}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const safeUrl = validateUrl(url);
  const res = await fetch(safeUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = validateUrl(queryKey.join("/") as string);
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
