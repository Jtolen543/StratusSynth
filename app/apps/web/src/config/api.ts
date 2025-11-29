import { config } from "@/config";

interface ClientAPIProps {
  path: string;
  options?: RequestInit;
  queryParams?: Record<string, string | number>;
}

export async function clientAPI({ path, options = {}, queryParams = {} }: ClientAPIProps) {
  let cleanedPath = path.replace(/^\/+/, "")

  if (cleanedPath.startsWith("api/")) cleanedPath = cleanedPath.slice("api/".length)

  const base = new URL("/api/", config.apiURL);
  const url = new URL(cleanedPath, base);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  return fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
}