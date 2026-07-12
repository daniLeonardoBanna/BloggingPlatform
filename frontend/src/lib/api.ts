import type { ApiEnvelope, PaginationMeta } from "./types";

// On the server, call the backend directly. In the browser, call the
// relative path proxied by the rewrite in next.config.ts (see comment
// there for why: avoids CORS without touching the backend's config).
const API_BASE_URL =
  typeof window === "undefined"
    ? `${process.env.BACKEND_ORIGIN || "http://localhost:3000"}/api/v1`
    : "/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; meta?: PaginationMeta }> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
  });

  const body = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok || !body.success) {
    throw new ApiError(body.message || "Request failed", res.status);
  }

  return { data: body.data, meta: body.meta };
}
