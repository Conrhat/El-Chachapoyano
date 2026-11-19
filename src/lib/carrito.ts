// Carrito compartido entre islas: el módulo es único en el navegador, así que todas las islas ven el mismo estado.
import { negocio } from "./negocio.ts";

export type Item = { id: string; nombre: string; precio: number; cantidad: number };
type Entrega = { tipo: "recojo" | "delivery"; nombre: string; direccion: string; referencia: string };

let items: Item[] = [];
const subs = new Set<() => void>();
const set = (nuevo: Item[]) => { items = nuevo; subs.forEach((f) => f()); };

export const carrito = {
  get: () => items,
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; },
};

export function agregar(i: Omit<Item, "cantidad">) {
  const ya = items.find((x) => x.id === i.id);
  set(ya ? items.map((x) => (x === ya ? { ...x, cantidad: x.cantidad + 1 } : x)) : [...items, { ...i, cantidad: 1 }]);
}
export function cambiar(id: string, delta: number) {
  set(items.map((x) => (x.id === id ? { ...x, cantidad: x.cantidad + delta } : x)).filter((x) => x.cantidad > 0));
}
export const vaciar = () => set([]);

// En céntimos para no arrastrar errores de coma flotante.
const cent = (n: number) => Math.round(n * 100);
export const soles = (n: number) => `S/ ${n.toFixed(2)}`;
export const total = (its: Item[]) => its.reduce((s, x) => s + cent(x.precio) * x.cantidad, 0) / 100;
export const cantidad = (its: Item[]) => its.reduce((s, x) => s + x.cantidad, 0);

export function mensajePedido(its: Item[], e: Entrega) {
  return [
    "Hola, quiero hacer un pedido 🙌",
    "",
    ...its.map((x) => `${x.cantidad} × ${x.nombre} — ${soles((cent(x.precio) * x.cantidad) / 100)}`),
    `Total: ${soles(total(its))}`,
    "",
    `Nombre: ${e.nombre.trim()}`,
    e.tipo === "recojo" ? "Entrega: recojo en el local" : "Entrega: delivery",
    ...(e.tipo === "delivery" ? [`Dirección: ${e.direccion.trim()}`, ...(e.referencia.trim() ? [`Referencia: ${e.referencia.trim()}`] : [])] : []),
    `Pago: Yape al ${negocio.yape}. Envío la captura por este chat.`,
  ].join("\n");
}
