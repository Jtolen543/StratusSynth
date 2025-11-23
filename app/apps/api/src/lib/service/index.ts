import { config } from "@/config";

interface ServiceClientProps {
  path: string
  method?: string
  body?: any
  queryParams?: Record<string, string | number>
  init?: RequestInit
}

export async function serviceClient<T = unknown>({ path, method = "GET", body, queryParams = {}, init = {} }: ServiceClientProps): Promise<T> {
  const url = new URL(path, `${config.baseURL}/cloud`);

  for (const [key, val] of Object.entries(queryParams)) {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Service-API-Key": config.serviceAPIKey,
    ...(init.headers || {}),
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Service error ${response.status}: ${text}`);
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return undefined as unknown as T;
}