// Carta y promo desde la hoja de Google Sheets (docs/contexto.md §4). Solo se usa al construir.
// Si la hoja no responde o viene vacía, se usan src/data/carta.json y promo.json.
import cartaJson from "../data/carta.json" with { type: "json" };
import promoJson from "../data/promo.json" with { type: "json" };
import { slug, valida, type Plato } from "./carta.ts";

// ID de la hoja: lo que va entre /d/ y /edit en su enlace. Vacío = solo JSON.
// La hoja debe estar compartida como "Cualquier persona con el enlace: Lector".
const HOJA_ID = "1x6l2qg8vDT-YYQol62COx70g1t9rzO0U_5jSeXzLgRM";

export type Promo = { titulo: string; descripcion: string; precio: number; vigencia: string };

// CSV (RFC 4180): comillas, comas y saltos de línea dentro de celdas.
export function leerCsv(txt: string): string[][] {
  const filas: string[][] = [[]];
  let celda = "", comillas = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (comillas) {
      if (c === '"' && txt[i + 1] === '"') (celda += '"'), i++;
      else if (c === '"') comillas = false;
      else celda += c;
    } else if (c === '"') comillas = true;
    else if (c === ",") filas.at(-1)!.push(celda), (celda = "");
    else if (c === "\n") filas.at(-1)!.push(celda.replace(/\r$/, "")), (celda = ""), filas.push([]);
    else celda += c;
  }
  filas.at(-1)!.push(celda);
  return filas.filter((f) => f.some((c) => c.trim()));
}

// Filas → objetos con claves sin tildes: "Precio entero" → "precio-entero".
export const objetos = (filas: string[][]) => {
  const [cab = [], ...resto] = filas;
  const claves = cab.map(slug);
  return resto.map((f) => Object.fromEntries(claves.map((k, i) => [k, (f[i] ?? "").trim()])));
};

// "S/ 34,99" → 34.99 · "" → NaN
export const numero = (s = "") => (s.trim() ? Number(s.replace(/[^\d.,]/g, "").replace(",", ".")) : NaN);
const si = (s = "") => /^(s[ií]|x|true|verdadero|1)$/i.test(s.trim());

export const aPlato = (o: Record<string, string>): Plato => {
  const origen = slug(o.origen ?? "");
  const entero = numero(o["precio-entero"]);
  return {
    categoria: o.categoria ?? "",
    plato: o.plato ?? "",
    descripcion: o.descripcion ?? "",
    precio: numero(o.precio),
    ...(entero > 0 && { precioEntero: entero }),
    origen: origen === "sierra" || origen === "selva" || origen === "fusion" ? origen : "",
    destacado: si(o.destacado),
    popular: si(o.popular),
    disponible: !o.disponible?.trim() || si(o.disponible), // vacío = disponible
    ...(o.foto && { foto: slug(o.foto) }),
  };
};

async function pestana(nombre: string) {
  const url = `https://docs.google.com/spreadsheets/d/${HOJA_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${nombre}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return objetos(leerCsv(await r.text()));
}

async function desdeHoja<T>(nombre: string, convertir: (o: Record<string, string>[]) => T | undefined, respaldo: T) {
  if (!HOJA_ID) return respaldo;
  try {
    const datos = convertir(await pestana(nombre));
    if (datos) return datos;
    console.warn(`[hoja] pestaña ${nombre} sin filas válidas; se usa el JSON`);
  } catch (e) {
    console.warn(`[hoja] no se pudo leer la pestaña ${nombre} (${e}); se usa el JSON`);
  }
  return respaldo;
}

export const carta = await desdeHoja(
  "Carta",
  (filas) => {
    const platos = filas.map(aPlato).filter(valida);
    return platos.length ? platos : undefined;
  },
  (cartaJson as Plato[]).filter(valida),
);

export const promo: Promo = await desdeHoja(
  "Promo",
  ([o]) => o && { titulo: o.titulo ?? "", descripcion: o.descripcion ?? "", precio: numero(o.precio), vigencia: o.vigencia ?? "" },
  promoJson,
);
