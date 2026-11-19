// Prueba rápida: node src/lib/negocio.check.ts
import assert from "node:assert/strict";
import { estado } from "./negocio.ts";

// 2026-11-21 es sábado. Hora de Lima = UTC-5.
assert.equal(estado(new Date("2026-11-21T14:00:00Z")), "Cerrado · abre hoy a las 10:00 a. m."); // 9:00
assert.equal(estado(new Date("2026-11-21T20:00:00Z")), "Abierto ahora · cierra a las 10:00 p. m."); // 15:00
assert.equal(estado(new Date("2026-11-22T03:30:00Z")), "Cerrado · abre mañana a las 10:00 a. m."); // sáb 22:30
assert.equal(estado(new Date("2026-11-22T21:59:00Z")), "Abierto ahora · cierra a las 5:00 p. m."); // dom 16:59
assert.equal(estado(new Date("2026-11-22T22:00:00Z")), "Cerrado · abre mañana a las 10:00 a. m."); // dom 17:00
console.log("ok");

// Reservas
import { horasReserva, mensajeReserva } from "./negocio.ts";
const sab = horasReserva("2026-11-21", new Date("2026-11-10T12:00:00Z"));
assert.equal(sab[0], 600); assert.equal(sab.at(-1), 21 * 60); // 10:00 … 9:00 p. m.
assert.equal(horasReserva("2026-11-22", new Date("2026-11-10T12:00:00Z")).at(-1), 16 * 60); // domingo hasta 4:00 p. m.
assert.equal(horasReserva("2026-11-21", new Date("2026-11-21T18:10:00Z"))[0], 13 * 60 + 30); // hoy 1:10 p. m. → desde 1:30
assert.equal(
  mensajeReserva({ nombre: " Rosa ", fecha: "2026-11-21", hora: 780, personas: 6, comentario: "cumpleaños" }),
  "Hola, quiero reservar una mesa 🙌\nNombre: Rosa\nFecha: sábado 21/11 · Hora: 1:00 p. m.\nPersonas: 6\nComentario: cumpleaños",
);

// Pedido
import { agregar, cambiar, carrito, mensajePedido, total } from "./carrito.ts";
agregar({ id: "a", nombre: "Trucha frita", precio: 27.99 });
agregar({ id: "a", nombre: "Trucha frita", precio: 27.99 });
agregar({ id: "b", nombre: "Ceviche", precio: 0.1 });
agregar({ id: "b", nombre: "Ceviche", precio: 0.2 });
assert.equal(total(carrito.get()), 56.18); // sin 56.180000000000007
cambiar("b", -2);
assert.deepEqual(carrito.get().map((x) => x.id), ["a"]);
const msg = mensajePedido(carrito.get(), { tipo: "delivery", nombre: "Ana", direccion: "Jr. Lima 1", referencia: "" });
assert.ok(msg.includes("2 × Trucha frita — S/ 55.98") && msg.includes("Dirección: Jr. Lima 1") && !msg.includes("Referencia"));
console.log("ok reservas y pedido");
