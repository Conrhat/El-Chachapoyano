// Prueba rápida: node src/lib/hoja.check.ts
import assert from "node:assert/strict";
import { aPlato, leerCsv, numero, objetos } from "./hoja.ts";

const csv = 'Categoría,Plato,Descripción,Precio,Precio entero,Origen,Destacado,Popular,Disponible,Foto\r\n' +
  '"Cuyes","Cuy, el ""tradicional""","Con papas\ny ají","37,99","69.99","Fusión","sí","","no","Trucha-Frita"\r\n,,,,,,,,,\r\n';
const filas = leerCsv(csv);
assert.equal(filas.length, 2); // la fila vacía se descarta
const p = aPlato(objetos(filas)[0]);
assert.deepEqual(p, {
  categoria: "Cuyes", plato: 'Cuy, el "tradicional"', descripcion: "Con papas\ny ají", precio: 37.99, precioEntero: 69.99,
  origen: "fusion", destacado: true, popular: false, disponible: false, foto: "trucha-frita",
});
assert.equal(aPlato({ plato: "X", precio: "S/ 10" }).disponible, true); // vacío = disponible
assert.ok(Number.isNaN(numero("")));
console.log("ok");
