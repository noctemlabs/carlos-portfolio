import { useCallback } from "react";
import { Card } from "./Card";
import { useHealth } from "../hooks/useHealth";
import { getApi, getRoot, routes, rootRoutes } from "../lib/http";

type ActuatorHealth = {
  status?: string; // "UP"
};

type StatusResponse = string; // your /api/status is text/plain likely ("OK")

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={
        ok
          ? "rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-900"
          : "rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-900"
      }
    >
      {ok ? "OK" : "DOWN"}
    </span>
  );
}

function Latency({ ms }: { ms?: number }) {
  return <span className="font-mono text-sm text-gray-700">{ms ?? "—"}ms</span>;
}

function statusLabel(data: unknown): string {
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const any = data as Record<string, unknown>;
      if (typeof any.status === "string") return any.status;
    }
    return "OK";
  }

export function LiveSystem() {
  const getProfileStatus = useCallback(() => getApi<StatusResponse>(routes.status), []);
  const getBffHealth = useCallback(() => getRoot<ActuatorHealth>(rootRoutes.actuatorHealth), []);

  const profileStatus = useHealth(getProfileStatus);
  const bffHealth = useHealth(getBffHealth);

  return (
    <section id="system" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-gray-900">Live System</h2>
      <p className="mt-2 max-w-3xl text-gray-700/70">
        A small “production mindset” panel: live endpoints, timing, and error surfacing.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card title="Profile Service" right={<StatusPill ok={profileStatus.ok} />}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Latency</span>
            <Latency ms={profileStatus.latencyMs} />
          </div>

          {profileStatus.ok && (
            <div className="mt-4 text-sm text-gray-700/80">
              Status: <span className="font-mono">{statusLabel(profileStatus.data)}</span>
            </div>
          )}

          {!profileStatus.ok && (
            <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-red-700">
              {profileStatus.error}
            </pre>
          )}
        </Card>

        <Card title="Frontend BFF Health" right={<StatusPill ok={bffHealth.ok} />}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Latency</span>
            <Latency ms={bffHealth.latencyMs} />
          </div>

          {bffHealth.ok && (
            <div className="mt-4 text-sm text-gray-700/80">
              Status: <span className="font-mono">{bffHealth.data?.status ?? "UP"}</span>
            </div>
          )}

          {!bffHealth.ok && (
            <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-red-700">
              {bffHealth.error}
            </pre>
          )}
        </Card>
      </div>
    </section>
  );
}
