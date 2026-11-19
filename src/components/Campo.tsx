import type { ReactNode } from "react";

// Etiqueta + control + mensaje de error junto al campo (no hay botones deshabilitados, §6).
export default function Campo({ etiqueta, error, children, className = "" }: { etiqueta: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 text-sm font-semibold ${className}`}>
      {etiqueta}
      {children}
      {error && <span className="font-normal text-cerrado">{error}</span>}
    </label>
  );
}
