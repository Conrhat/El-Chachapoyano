// Clases de Tailwind reutilizadas (estados de docs/contexto.md §6: hover, activo, foco).
const foco = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foco";
const trans = "transition duration-200 ease-salida motion-reduce:transition-none";

export const btn = `inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-boton px-6 font-semibold text-boton-texto hover:bg-boton-hover active:scale-[0.98] active:bg-boton-activo ${trans} ${foco}`;
export const btn2 = `inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border-[1.5px] border-boton2-borde px-4 font-semibold text-boton2-texto hover:bg-boton2-hover active:scale-[0.98] ${trans} ${foco}`;
export const campo = `min-h-12 w-full rounded-md border border-borde-fuerte bg-fondo px-3 text-base font-normal text-texto ${foco}`;
export const enlace = `text-enlace font-semibold underline underline-offset-2 ${foco}`;

const pill = "inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold";
export const etiquetas = {
  sierra: { texto: "Sierra", clase: `${pill} bg-sierra-fondo text-sierra-texto` },
  selva: { texto: "Selva", clase: `${pill} bg-selva-fondo text-selva-texto` },
  fusion: { texto: "Fusión", clase: `${pill} bg-fusion-fondo text-fusion-texto` },
  popular: { texto: "✦ La más popular", clase: `${pill} border border-popular-borde text-popular-texto` },
  agotado: { texto: "Agotado hoy", clase: `${pill} border border-borde-fuerte bg-fondo-alterno text-texto-suave` },
};
