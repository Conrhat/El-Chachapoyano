import { etiquetas } from "./clases.ts";

// Una fila de la pestaña `Carta` de la hoja (docs/contexto.md §4); se carga en hoja.ts.
export type Plato = {
  categoria: string;
  plato: string;
  descripcion: string;
  precio: number;
  precioEntero?: number; // ponytail: solo los cuyes (½ / entero); confirmar columna en la hoja
  origen: "" | "sierra" | "selva" | "fusion";
  destacado: boolean;
  popular: boolean;
  disponible: boolean;
  foto?: string; // nombre del archivo en src/assets/platos, sin extensión
};

// Filas sin nombre o con precio vacío/inválido se omiten.
export const valida = (p: Plato) => !!p.plato?.trim() && Number.isFinite(p.precio) && p.precio > 0;

export const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const etiquetasDe = (p: Plato) =>
  [p.origen && etiquetas[p.origen], p.popular && etiquetas.popular, !p.disponible && etiquetas.agotado].filter(
    (e): e is { texto: string; clase: string } => !!e,
  );

// Lo que se agrega al carrito por cada botón del plato.
export const opciones = (p: Plato) =>
  p.precioEntero
    ? [
        { id: `${slug(p.plato)}-medio`, nombre: `${p.plato} (½)`, precio: p.precio, etiqueta: "½" },
        { id: `${slug(p.plato)}-entero`, nombre: `${p.plato} (entero)`, precio: p.precioEntero, etiqueta: "Entero" },
      ]
    : [{ id: slug(p.plato), nombre: p.plato, precio: p.precio, etiqueta: "" }];

// Subtítulos de las bandas de categoría (del diseño de la landing).
export const subtitulos: Record<string, string> = {
  Combos: "Para compartir",
  Cuyes: "½ cuy o entero",
  Truchas: "De las lagunas andinas",
  Cecinas: "De res y de chancho",
  Paiches: "Pescado amazónico",
};
