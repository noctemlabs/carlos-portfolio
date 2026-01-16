import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "/api",
  timeout: 8000,
});

export const routes = {
  projects: "/projects",
  experience: "/experience",
  status: "/status",
  version: "/version",
} as const;

// Actuator is NOT under /api
export const root = axios.create({
  baseURL: "",
  timeout: 8000,
});

export const rootRoutes = {
  actuatorHealth: "/actuator/health",
} as const;

/**
 * Works with TS configs that disallow parameter properties.
 */
export class HttpError extends Error {
  status?: number;
  url: string;
  contentType?: string;
  bodyPreview?: string;

  constructor(message: string, url: string, status?: number, contentType?: string, bodyPreview?: string) {
    super(message);
    this.name = "HttpError";
    this.url = url;
    this.status = status;
    this.contentType = contentType;
    this.bodyPreview = bodyPreview;
  }
}

function previewBody(data: unknown, max = 200): string | undefined {
  if (data == null) return undefined;
  if (typeof data === "string") return data.slice(0, max);
  try {
    return JSON.stringify(data).slice(0, max);
  } catch {
    return undefined;
  }
}

function toHttpError(e: unknown, url: string): HttpError {
  // Axios errors give us status, headers, response body
  if (axios.isAxiosError(e)) {
    const ae = e as AxiosError;
    const status = ae.response?.status;
    const contentType =
      (ae.response?.headers as any)?.["content-type"] ??
      (ae.response?.headers as any)?.["Content-Type"];
    const bodyPreview = previewBody(ae.response?.data);
    return new HttpError(ae.message, url, status, contentType, bodyPreview);
  }

  if (e instanceof Error) return new HttpError(e.message, url);
  return new HttpError("Unknown error", url);
}

export async function getApi<T>(path: string): Promise<{ data: T; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await api.get<T>(path);
    const latencyMs = Math.round(performance.now() - start);
    return { data: res.data, latencyMs };
  } catch (e) {
    throw toHttpError(e, `${api.defaults.baseURL ?? ""}${path}`);
  }
}

export async function getRoot<T>(path: string): Promise<{ data: T; latencyMs: number }> {
  const start = performance.now();
  try {
    const res = await root.get<T>(path);
    const latencyMs = Math.round(performance.now() - start);
    return { data: res.data, latencyMs };
  } catch (e) {
    throw toHttpError(e, path);
  }
}