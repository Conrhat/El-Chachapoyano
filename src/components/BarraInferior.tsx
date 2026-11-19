import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { latido, subirBarra } from "../lib/animar.ts";
import { cambiar, cantidad, carrito, mensajePedido, soles, total, vaciar } from "../lib/carrito.ts";
import { btn, btn2, campo, enlace } from "../lib/clases.ts";
import { negocio, waLink } from "../lib/negocio.ts";
import Campo from "./Campo.tsx";

const icono = "size-5";
const accion =
  "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[13px] font-semibold text-texto focus-visible:outline-2 focus-visible:outline-foco";

export default function BarraInferior() {
  const items = useSyncExternalStore(carrito.subscribe, carrito.get, carrito.get);
  const dialogo = useRef<HTMLDialogElement>(null);
  const n = cantidad(items);
  const barra = useRef<HTMLDivElement>(null);
  const resumen = useRef<HTMLParagraphElement>(null);
  const antes = useRef(0);
  useEffect(() => {
    if (n > 0 && antes.current === 0) subirBarra(barra.current);
    else if (n > antes.current) latido(resumen.current);
    antes.current = n;
  }, [n]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3">
      <div ref={barra} className="mx-auto flex max-w-[720px] items-center gap-2 rounded-xl border border-borde bg-tarjeta p-2.5 shadow-flotante">
        {n > 0 ? (
          <>
            <p ref={resumen} className="min-w-0 flex-1 origin-left pl-2" aria-live="polite">
              <span className="block font-semibold">
                <span className="tabular-nums">{n}</span>{" "}
                {n === 1 ? "plato" : "platos"} · <span className="tabular-nums">{soles(total(items))}</span>
              </span>
              <span className="block text-[13px] text-texto-suave">Recojo o delivery · pago con Yape</span>
            </p>
            <button type="button" onClick={vaciar} className={`${enlace} min-h-11 px-3 text-sm no-underline`}>Vaciar</button>
            <button type="button" onClick={() => dialogo.current?.showModal()} className={`${btn} min-h-11 whitespace-nowrap px-[18px] text-[15px]`}>
              Ver pedido
            </button>
          </>
        ) : (
          <>
            <a href="#reservar" className={accion}>
              <svg className={icono} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>
              Reservar
            </a>
            <a href={`https://wa.me/${negocio.whatsapp}`} className={accion}>
              <svg className={icono} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
              WhatsApp
            </a>
            <a href={negocio.links.maps} className={accion}>
              <svg className={icono} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              Cómo llegar
            </a>
          </>
        )}
      </div>

      <dialog
        ref={dialogo}
        aria-labelledby="pedido-t"
        className="mt-auto mb-0 max-h-[92dvh] w-full max-w-[560px] rounded-t-xl bg-fondo p-0 text-texto shadow-flotante sm:mx-auto"
      >
        <Pedido cerrar={() => dialogo.current?.close()} />
      </dialog>
    </div>
  );
}

function Pedido({ cerrar }: { cerrar: () => void }) {
  const items = useSyncExternalStore(carrito.subscribe, carrito.get, carrito.get);
  const [tipo, setTipo] = useState<"recojo" | "delivery">("recojo");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [copiado, setCopiado] = useState(false);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!nombre.trim()) err.nombre = "Escribe tu nombre.";
    if (tipo === "delivery" && !direccion.trim()) err.direccion = "Escribe la dirección de entrega.";
    if (items.length === 0) err.items = "Tu pedido está vacío.";
    setErrores(err);
    if (Object.keys(err).length) return;
    window.open(waLink(mensajePedido(items, { tipo, nombre, direccion, referencia })), "_blank", "noopener");
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(negocio.yape.replace(/\s/g, ""));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  };

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="pedido-t" className="text-2xl">Tu pedido</h2>
        <button type="button" onClick={cerrar} className={`${btn2} min-h-11 border-borde px-3 text-sm`}>Cerrar</button>
      </div>

      {items.length === 0 ? (
        <p className="text-texto-suave">{errores.items ?? "Aún no agregaste platos."}</p>
      ) : (
        <ul className="divide-y divide-borde border-y border-borde">
          {items.map((x) => (
            <li key={x.id} className="flex items-center gap-3 py-2.5">
              <span className="min-w-0 flex-1">{x.nombre}</span>
              <span className="flex items-center gap-1">
                <button type="button" aria-label={`Quitar un ${x.nombre}`} onClick={() => cambiar(x.id, -1)} className={`${btn2} size-11 px-0 text-xl`}>−</button>
                <span className="w-7 text-center tabular-nums">{x.cantidad}</span>
                <button type="button" aria-label={`Agregar un ${x.nombre}`} onClick={() => cambiar(x.id, 1)} className={`${btn2} size-11 px-0 text-xl`}>+</button>
              </span>
              <span className="w-24 text-right font-semibold tabular-nums">{soles(x.precio * x.cantidad)}</span>
            </li>
          ))}
          <li className="flex justify-between py-2.5 text-lg font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{soles(total(items))}</span>
          </li>
        </ul>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">¿Cómo lo recibes?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["recojo", "delivery"] as const).map((t) => (
            <label
              key={t}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border-[1.5px] font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco ${
                tipo === t ? "border-texto bg-texto text-fondo" : "border-borde-fuerte"
              }`}
            >
              <input type="radio" name="tipo" value={t} checked={tipo === t} onChange={() => setTipo(t)} className="sr-only" />
              {t === "recojo" ? "Recojo en el local" : "Delivery"}
            </label>
          ))}
        </div>
      </fieldset>

      <Campo etiqueta="Tu nombre" error={errores.nombre}>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" className={campo} />
      </Campo>
      {tipo === "delivery" && (
        <>
          <Campo etiqueta="Dirección" error={errores.direccion}>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} autoComplete="street-address" className={campo} />
          </Campo>
          <Campo etiqueta="Referencia (opcional)">
            <input value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Frente al parque, puerta verde…" className={campo} />
          </Campo>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-borde bg-tarjeta p-4">
        <p className="text-sm">
          Paga con <strong>Yape</strong> al <strong className="tabular-nums">{negocio.yape}</strong>
          <span className="block text-texto-suave">Envía la captura por el mismo chat.</span>
        </p>
        <button type="button" onClick={copiar} className={`${btn2} text-sm`} aria-live="polite">
          {copiado ? "Copiado ✓" : "Copiar número"}
        </button>
      </div>

      <button type="submit" className={btn}>
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
        Enviar pedido por WhatsApp
      </button>
    </form>
  );
}
