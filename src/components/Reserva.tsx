import { useEffect, useRef, useState, type FormEvent } from "react";
import { contador } from "../lib/animar.ts";
import { btn, btn2, campo } from "../lib/clases.ts";
import { formatoHora, hoyLima, horasReserva, mensajeReserva, waLink } from "../lib/negocio.ts";
import Campo from "./Campo.tsx";

export default function Reserva() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hoy, setHoy] = useState("");
  const [hora, setHora] = useState<number | "">("");
  const [personas, setPersonas] = useState(2);
  const [comentario, setComentario] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const numero = useRef<HTMLSpanElement>(null);
  const personasAntes = useRef(personas);
  useEffect(() => {
    if (personas !== personasAntes.current) contador(numero.current, personas > personasAntes.current);
    personasAntes.current = personas;
  }, [personas]);

  // La fecha de hoy se calcula en el navegador (en el servidor sería la fecha de publicación).
  useEffect(() => {
    const h = hoyLima();
    setHoy(h);
    setFecha(h);
  }, []);

  const horas = fecha ? horasReserva(fecha) : [];
  // Si cambia la fecha y la hora elegida ya no existe ese día, se limpia.
  useEffect(() => {
    if (hora !== "" && !horas.includes(hora)) setHora("");
  }, [fecha]);

  const vista = mensajeReserva({
    nombre: nombre || "…",
    fecha: fecha || hoy || "2026-01-01",
    hora: hora === "" ? (horas[0] ?? 600) : hora,
    personas,
    comentario,
  });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!nombre.trim()) err.nombre = "Escribe tu nombre.";
    if (!fecha || fecha < hoy) err.fecha = "Elige una fecha de hoy en adelante.";
    else if (hora === "") err.hora = horas.length ? "Elige una hora." : "Ese día ya no quedan horas.";
    setErrores(err);
    if (Object.keys(err).length || hora === "") return;
    window.open(waLink(mensajeReserva({ nombre, fecha, hora, personas, comentario })), "_blank", "noopener");
  };

  return (
    <div className="flex flex-wrap gap-10">
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
        <div className="flex items-center gap-2.5 text-acento" aria-hidden="true">
          <span className="h-px w-8 origin-right bg-acento" data-anim="line" /><span className="inline-block" data-anim="star">✦</span>
        </div>
        <h2 data-anim="up" id="reservar-t" className="text-4xl leading-tight">Reserva tu mesa</h2>
        <p className="text-texto-suave">Completa los datos y te llevamos a WhatsApp con el mensaje listo. Te confirmamos por el mismo chat.</p>
        <div data-anim="up" data-delay="200" className="mt-3 whitespace-pre-line rounded-lg border border-borde bg-tarjeta p-4 text-sm">
          <span className="mb-1.5 block font-semibold text-texto-suave">Así llegará tu mensaje</span>
          {vista}
        </div>
      </div>

      <form onSubmit={enviar} noValidate data-anim="right" data-delay="120" className="grid min-w-0 flex-[1_1_380px] grid-cols-2 gap-4 rounded-lg border border-borde bg-tarjeta p-6">
        <Campo etiqueta="Nombre" error={errores.nombre} className="col-span-2">
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Rosa Pérez" className={campo} />
        </Campo>
        <Campo etiqueta="Fecha" error={errores.fecha}>
          <input type="date" value={fecha} min={hoy} onChange={(e) => setFecha(e.target.value)} className={campo} />
        </Campo>
        <Campo etiqueta="Hora" error={errores.hora}>
          <select value={hora} onChange={(e) => setHora(e.target.value === "" ? "" : Number(e.target.value))} className={campo}>
            <option value="">{horas.length ? "Elige" : "Sin horas"}</option>
            {horas.map((h) => (
              <option key={h} value={h}>{formatoHora(h)}</option>
            ))}
          </select>
        </Campo>
        <div className="col-span-2 flex flex-col gap-1.5">
          <span id="personas-l" className="text-sm font-semibold">Personas</span>
          <div role="group" aria-labelledby="personas-l" className="flex items-center gap-3">
            <button type="button" aria-label="Una persona menos" onClick={() => setPersonas((p) => Math.max(1, p - 1))} className={`${btn2} size-12 px-0 text-2xl`}>−</button>
            <span ref={numero} className="inline-block min-w-10 text-center font-display text-2xl tabular-nums" aria-live="polite">{personas}</span>
            <button type="button" aria-label="Una persona más" onClick={() => setPersonas((p) => Math.min(30, p + 1))} className={`${btn2} size-12 px-0 text-2xl`}>+</button>
          </div>
        </div>
        <Campo etiqueta="Comentario (opcional)" className="col-span-2">
          <textarea rows={3} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Cumpleaños, mesa en el patio…" className={`${campo} resize-y py-2.5`} />
        </Campo>
        <button type="submit" className={`${btn} col-span-2`}>
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
          Reservar por WhatsApp
        </button>
      </form>
    </div>
  );
}
