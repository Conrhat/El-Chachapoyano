// Datos fijos del restaurante. Fuente: docs/contexto.md §1.
export const negocio = {
  nombre: "El Chachapoyano",
  direccion: "Jr. San Pablo de la Cruz 359, Tarapoto",
  whatsapp: "51978382572",
  yape: "918 684 302",
  links: {
    instagram: "https://www.instagram.com/elchachapoyano_restaurante/",
    facebook: "https://web.facebook.com/elchachapoyanorestaurante",
    tripadvisor:
      "https://www.tripadvisor.com/Restaurant_Review-g658384-d25156523-Reviews-El_Chachapoyano_Restaurante-Tarapoto_San_Martin_Region.html",
    maps: "https://maps.app.goo.gl/wbAuS3cf4owTTW2g9",
    reel: "https://www.instagram.com/reel/Cl-AM4hjimp/",
    cartaPdf: "https://drive.google.com/file/d/1yqxUNXUvU2LClf1sed-FkSJKzAao99l_/view",
  },
} as const;

type Calificacion = { valor: number; cantidad: number } | null;
// ponytail: sin números reales todavía (§7); con null la tarjeta muestra solo el enlace.
export const calificaciones: { google: Calificacion; tripadvisor: Calificacion } = { google: null, tripadvisor: null };

export const waLink = (texto: string) =>
  `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;

// Horario en minutos desde medianoche, índice = día de la semana (0 = domingo).
const CORTO: [number, number] = [10 * 60, 17 * 60];
const LARGO: [number, number] = [10 * 60, 22 * 60];
export const horario: [number, number][] = [CORTO, CORTO, CORTO, CORTO, CORTO, LARGO, LARGO];

export const formatoHora = (min: number) => {
  const h = Math.floor(min / 60), m = min % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
};

// Hora local de Tarapoto (America/Lima, UTC-5 sin horario de verano), sin importar la zona del visitante.
export function horaLima(fecha: Date) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(fecha);
  const v = (t: string) => p.find((x) => x.type === t)!.value;
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(v("weekday"));
  return { dia, min: Number(v("hour")) * 60 + Number(v("minute")) };
}

export function estado(fecha = new Date()) {
  const { dia, min } = horaLima(fecha);
  const [abre, cierra] = horario[dia];
  if (min >= abre && min < cierra) return `Abierto ahora · cierra a las ${formatoHora(cierra)}`;
  if (min < abre) return `Cerrado · abre hoy a las ${formatoHora(abre)}`;
  return `Cerrado · abre mañana a las ${formatoHora(horario[(dia + 1) % 7][0])}`;
}

export const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
// Orden de la tabla de horarios: lunes primero.
export const ordenSemana = [1, 2, 3, 4, 5, 6, 0];

// Fecha de hoy en Tarapoto, como "AAAA-MM-DD".
export const hoyLima = (fecha = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(fecha);

const diaDe = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).getDay();
};

// Horas de reserva cada 30 min, hasta una hora antes del cierre. Si es hoy, solo las que aún no pasan.
export function horasReserva(iso: string, ahora = new Date()) {
  const [abre, cierra] = horario[diaDe(iso)];
  const desde = iso === hoyLima(ahora) ? horaLima(ahora).min : -1;
  const horas: number[] = [];
  for (let m = abre; m <= cierra - 60; m += 30) if (m > desde) horas.push(m);
  return horas;
}

export function mensajeReserva(r: { nombre: string; fecha: string; hora: number; personas: number; comentario: string }) {
  const [, m, d] = r.fecha.split("-");
  return [
    "Hola, quiero reservar una mesa 🙌",
    `Nombre: ${r.nombre.trim()}`,
    `Fecha: ${dias[diaDe(r.fecha)].toLowerCase()} ${d}/${m} · Hora: ${formatoHora(r.hora)}`,
    `Personas: ${r.personas}`,
    ...(r.comentario.trim() ? [`Comentario: ${r.comentario.trim()}`] : []),
  ].join("\n");
}
