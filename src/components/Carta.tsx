import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cambioCategoria, pop } from "../lib/animar.ts";
import { agregar, carrito, soles } from "../lib/carrito.ts";
import { etiquetasDe, opciones, subtitulos, type Plato } from "../lib/carta.ts";
import { btn2 } from "../lib/clases.ts";

export default function Carta({ platos }: { platos: Plato[] }) {
  const categorias = [...new Set(platos.map((p) => p.categoria))];
  const [cat, setCat] = useState(categorias[0]);
  const items = useSyncExternalStore(carrito.subscribe, carrito.get, carrito.get);
  const banda = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) primera.current = false;
    else cambioCategoria(banda.current, listaRef.current);
  }, [cat]);
  const cuenta = (id: string) => items.find((x) => x.id === id)?.cantidad ?? 0;

  // Los agotados van al final de su categoría.
  const lista = platos.filter((p) => p.categoria === cat).sort((a, b) => Number(b.disponible) - Number(a.disponible));

  return (
    <>
      <div role="group" aria-label="Categorías" data-stagger="zoom" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1.5 sm:justify-center">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === cat}
            onClick={() => setCat(c)}
            className={`min-h-11 shrink-0 cursor-pointer whitespace-nowrap rounded-full border-[1.5px] px-[18px] font-semibold transition-colors duration-200 ease-salida focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foco motion-reduce:transition-none ${
              c === cat ? "border-texto bg-texto text-fondo" : "border-borde-fuerte text-texto hover:bg-boton2-hover"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div ref={banda} data-anim="zoom" className="mb-4 origin-center rounded-sm border border-banda-borde bg-banda p-3.5 text-center">
        <h3 className="text-[26px] tracking-wide text-banda-texto">{cat}</h3>
        {subtitulos[cat] && (
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.24em] text-acento">{subtitulos[cat]}</p>
        )}
      </div>

      <ul ref={listaRef} data-stagger="up" className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <li
            key={p.plato}
            className="flex flex-col gap-2 rounded-lg border border-borde bg-tarjeta p-4 transition duration-200 ease-salida hover:border-borde-fuerte hover:shadow-md motion-reduce:transition-none dark:hover:bg-tarjeta-hover dark:hover:shadow-none"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h4 className={`font-display text-lg leading-tight ${p.disponible ? "" : "text-texto-suave"}`}>{p.plato}</h4>
              <span className={`shrink-0 font-semibold tabular-nums ${p.disponible ? "" : "text-texto-suave"}`}>
                {p.precioEntero ? `desde ${soles(p.precio)}` : soles(p.precio)}
              </span>
            </div>
            <p className="text-sm text-texto-suave">{p.descripcion}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex flex-wrap gap-1.5">
                {etiquetasDe(p).map((e) => (
                  <span key={e.texto} className={e.clase}>{e.texto}</span>
                ))}
              </div>
              {p.disponible && (
                <div className="ml-auto flex gap-2">
                  {opciones(p).map((o) => (
                    <button key={o.id} type="button" onClick={(e) => { pop(e.currentTarget); agregar(o); }} className={`${btn2} text-sm tabular-nums`}>
                      {o.etiqueta ? `${o.etiqueta} · ${soles(o.precio)}` : "Agregar"}
                      {cuenta(o.id) > 0 && ` (${cuenta(o.id)})`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
