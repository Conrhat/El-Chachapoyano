// Animaciones del diseño de la landing con la Web Animations API del navegador (0 KB de librerías).
// Si el JS no corre o el visitante pide menos movimiento, todo se ve quieto y completo.

const E = "cubic-bezier(0.22, 1, 0.36, 1)"; // --ease-salida
const B = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // --ease-rebote

type Def = [Keyframe[], number, string, number?];
const K: Record<string, Def> = {
  up: [[{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], 520, E],
  left: [[{ opacity: 0, transform: "translateX(-36px)" }, { opacity: 1, transform: "none" }], 600, E],
  right: [[{ opacity: 0, transform: "translateX(36px)" }, { opacity: 1, transform: "none" }], 600, E],
  zoom: [[{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], 480, E],
  draw: [[{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 700, E],
  line: [[{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], 500, E],
  star: [[{ opacity: 0, transform: "scale(0) rotate(-180deg)" }, { opacity: 1, transform: "none" }], 520, B],
  nudge: [[{ transform: "none" }, { transform: "translateX(6px)" }, { transform: "none" }], 700, "ease-in-out", 3],
};

export const quieto = () => {
  try {
    return !document.body.animate || matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
};

// Primer ancestro con caja propia (salta envoltorios con display: contents, como <astro-island>).
const conCaja = (el: Element | null): Element | null =>
  el && getComputedStyle(el).display === "contents" ? conCaja(el.parentElement) : el;

// Entradas al hacer scroll: [data-anim] (con data-delay opcional) y
// [data-stagger], que anima cada hijo con 70 ms de diferencia (máx. 8 pasos).
// La portada no pasa por aquí: su entrada es CSS puro ([data-hero] en global.css).
export function iniciarEntradas() {
  if (quieto()) return;
  const porGatillo = new Map<Element, Animation[]>();
  const preparar = (el: Element, tipo: string, delay: number, gatillo: Element) => {
    const k = K[tipo];
    if (!k) return;
    const a = el.animate(k[0], { duration: k[1], easing: k[2], delay, iterations: k[3] ?? 1, fill: "backwards" });
    a.pause(); // en pausa en el primer cuadro hasta que el gatillo entre en pantalla
    porGatillo.set(gatillo, [...(porGatillo.get(gatillo) ?? []), a]);
  };
  for (const el of document.querySelectorAll<HTMLElement>("[data-anim]")) {
    const tipo = el.dataset.anim!, d = Number(el.dataset.delay ?? 0);
    // El gatillo es el contenedor: un elemento en escala 0 (draw, line, star)
    // mide cero y el IntersectionObserver nunca lo vería entrar.
    preparar(el, tipo, d, conCaja(el.parentElement) ?? el);
  }
  for (const caja of document.querySelectorAll<HTMLElement>("[data-stagger]"))
    [...caja.children].forEach((c, i) => preparar(c, caja.dataset.stagger!, Math.min(i, 8) * 70, caja));

  const io = new IntersectionObserver(
    (entradas) => {
      for (const en of entradas) {
        if (!en.isIntersecting) continue;
        porGatillo.get(en.target)?.forEach((a) => a.play());
        io.unobserve(en.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  porGatillo.forEach((_, g) => io.observe(g));
}

// Microinteracciones.
const animar = (el: Element | null | undefined, k: Keyframe[], duration: number, easing = E, delay = 0) => {
  if (el && !quieto()) el.animate(k, { duration, easing, delay, fill: "backwards" });
};
export const pop = (el?: Element | null) =>
  animar(el, [{ transform: "scale(1)" }, { transform: "scale(0.9)" }, { transform: "scale(1.06)" }, { transform: "none" }], 340);
export const latido = (el?: Element | null) =>
  animar(el, [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }], 320);
export const subirBarra = (el?: Element | null) => animar(el, [{ transform: "translateY(130%)" }, { transform: "none" }], 520, B);
export const girar = (el?: Element | null) =>
  animar(el, [{ opacity: 0, transform: "rotate(-120deg) scale(0.5)" }, { opacity: 1, transform: "none" }], 420, B);
export const contador = (el: Element | null | undefined, sube: boolean) =>
  animar(el, [{ opacity: 0, transform: `translateY(${sube ? "60%" : "-60%"})` }, { opacity: 1, transform: "none" }], 240);
export function cambioCategoria(banda?: Element | null, lista?: Element | null) {
  animar(banda, [{ opacity: 0.4, transform: "scaleX(0.96)" }, { opacity: 1, transform: "none" }], 320);
  [...(lista?.children ?? [])].forEach((c, i) =>
    animar(c, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], 380, E, Math.min(i, 8) * 45),
  );
}

// Punto de "Abierto ahora": onda que se expande 3 veces y se detiene (§5).
export const onda = (el?: Element | null) => {
  if (el && !quieto())
    el.animate([{ transform: "scale(1)", opacity: 0.6 }, { transform: "scale(2.8)", opacity: 0 }], { duration: 1800, iterations: 3, easing: "ease-out" });
};
