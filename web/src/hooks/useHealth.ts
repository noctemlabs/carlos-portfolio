import { useEffect, useState } from "react";
import { HttpError } from "../lib/http";

type HealthState<T> = {
  loading: boolean;
  ok: boolean;
  latencyMs?: number;
  data?: T;
  error?: string;
};

export function useHealth<T>(fn: () => Promise<{ data: T; latencyMs: number }>) {
  const [state, setState] = useState<HealthState<T>>({ loading: true, ok: false });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ loading: true, ok: false });
      try {
        const { data, latencyMs } = await fn();
        if (cancelled) return;
        setState({ loading: false, ok: true, latencyMs, data });
      } catch (e) {
        if (cancelled) return;

        const err =
          e instanceof HttpError
            ? [
                e.message,
                e.status ? `(${e.status})` : "",
                e.contentType ? `— ${e.contentType}` : "",
                e.bodyPreview ? `— ${e.bodyPreview}` : "",
              ]
                .filter(Boolean)
                .join(" ")
            : e instanceof Error
              ? e.message
              : "Unknown error";

        setState({ loading: false, ok: false, error: err });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [fn]);

  return state;
}
