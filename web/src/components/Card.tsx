import React from "react";

export function Card(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-700/90">{props.title}</h3>
        {props.right}
      </div>
      <div className="mt-3 text-sm text-gray-700/80">{props.children}</div>
    </div>
  );
}
