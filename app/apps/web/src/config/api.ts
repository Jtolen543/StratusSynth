import { config } from "@/config";

interface ClientAPIProps {
  path: string;
  options?: RequestInit;
  queryParams?: Record<string, string | number>;
}

export async function clientAPI({ path, options = {}, queryParams = {} }: ClientAPIProps) {
  const url = new URL(path, config.apiURL);

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