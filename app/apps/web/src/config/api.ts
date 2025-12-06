import { config } from "@/config";

interface ClientAPIProps {
  path: string;
  options?: RequestInit;
  queryParams?: Record<string, string | number>;
  platform?: boolean;
  errorHandler?: (response: Response) => void
}

export async function clientAPI<T = unknown>({ path, options = {}, queryParams = {}, errorHandler = undefined, platform = false }: ClientAPIProps): Promise<T> {
  let relativePath = path.replace(/^\/+/, "")

  if (relativePath.startsWith("api/")) relativePath = relativePath.slice("api/".length)

  const base = new URL(`/api/${platform ? 'platform/' : ''}`, config.apiURL);
  const url = new URL(relativePath, base);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (errorHandler) {
    errorHandler(response)
  } else {
    if (!response.ok) {
      const text = await response.text()
      throw new Error (`API Error - ${response.status} - ${text}`)
    }
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return (await response.json()) as T
  }

  return undefined as unknown as T
}