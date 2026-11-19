# Contexto del proyecto: página promocional de El Chachapoyano

> Documento de contexto para continuar el trabajo. Reúne lo decidido sobre estructura, especificaciones técnicas e identidad visual. Lo marcado como **pendiente** aún no está confirmado.

---

## 1. El negocio

- **Nombre:** El Chachapoyano Restaurante (pendiente confirmar si se menciona "La Retama"; ver §7).
- **Tipo:** pollería y restaurante de fusión gastronómica andina (Chachapoyas, Amazonas) y amazónica (Tarapoto, San Martín). Más de 70 platos.
- **Platos y categorías de la carta:** combos, cuyes, truchas, pescados amazónicos, sudados, paiches, cecinas, chaufas, chancho, res, pollo, "Los nuevos de nuestra cocina", tallarines y tortillas, lonches, anticuchos, piqueos, guarniciones, sándwiches, bebidas calientes, jugos y refrescos, cervezas, cócteles y licores, vinos, gaseosas, carta de bar.
- **Dirección:** Jr. San Pablo de la Cruz 359, Tarapoto.
- **Horarios:**
  - Lunes, martes, miércoles, jueves y domingo: 10:00 a. m. – 5:00 p. m.
  - Viernes y sábado: 10:00 a. m. – 10:00 p. m.
- **Servicios:** consumo en local, **reservas** (por WhatsApp) y **delivery**.

### Contacto y enlaces
| Dato | Valor |
|---|---|
| WhatsApp (reservas, pedidos, delivery, contacto) | 978 382 572 → `https://wa.me/51978382572` |
| Yape (pagos) | 918 684 302 |
| Cuentas bancarias (de la carta) | BCP soles 191-94013467-0-96 · BBVA soles 0011-0814-0215870516 |
| Instagram | https://www.instagram.com/elchachapoyano_restaurante/ |
| Facebook | https://web.facebook.com/elchachapoyanorestaurante |
| Tripadvisor | https://www.tripadvisor.com/Restaurant_Review-g658384-d25156523-Reviews-El_Chachapoyano_Restaurante-Tarapoto_San_Martin_Region.html |
| Google Maps (ubicación) | https://maps.app.goo.gl/wbAuS3cf4owTTW2g9 |
| Video tour (reel) | https://www.instagram.com/reel/Cl-AM4hjimp/ |
| Promoción de la semana (Drive) | https://drive.google.com/file/d/1AritpcNje67y9uhfn5lbdNicQyLz96YM/view |
| Carta en PDF (Drive) — solo como fuente para la carga inicial; no se enlaza en la web | https://drive.google.com/file/d/1yqxUNXUvU2LClf1sed-FkSJKzAao99l_/view |

---

## 2. Objetivo

Reemplazar la página de **biolink.info** que hoy está en la bio de Instagram. Esa página:
- Es una lista de botones que mandan a Drive, Maps, Tripadvisor, etc.
- Carga **anuncios de Google** (incluido uno de pantalla completa).
- Tiene enlaces rotos: los íconos de Facebook y Messenger tienen la URL duplicada, el ícono de WhatsApp no tiene código de país y "Déjanos tu opinión" apunta al mapa en lugar de las reseñas.
- Incluye un formulario "Regístrate" que es de biolink, no del restaurante (**se elimina**).

La nueva página debe mostrar el contenido dentro de la web, retener al visitante y convertir en **reservas** y **pedidos por WhatsApp**.

---

## 3. Estructura de la página

Landing de una sola página, pensada primero para celular (el tráfico llega desde Instagram).

1. **Portada:** logo, nombre, "Pollería · sierra y selva", foto del plato estrella, indicador "Abierto ahora / cierra a las…". Botones: **Reservar mesa** (principal) y **Ver la carta**.
2. **Promoción de la semana:** imagen y datos de la promo dentro de la página.
3. **Nuestra carta:** categorías leídas desde Google Sheets, etiquetas de origen (Sierra / Selva / Fusión), carrito y pedido por WhatsApp.
4. **La fusión:** texto corto sobre la cocina de la sierra y la selva, con scroll narrativo.
5. **Nuestros ambientes:** video tour y fotos del local.
6. **Opiniones:** Google y Tripadvisor, con botón "Déjanos tu opinión".
7. **Reserva tu mesa:** formulario que arma un mensaje de WhatsApp.
8. **Ubicación y horarios:** mapa, dirección y horarios con el día actual resaltado.
9. **Pie:** redes y contacto.

**Barra fija inferior (móvil):** Reservar · WhatsApp · Cómo llegar.

### Reservas
Formulario con nombre, fecha, hora (solo dentro del horario de ese día), número de personas y comentario opcional. Al enviar, abre WhatsApp con este mensaje ya escrito:

```
Hola, quiero reservar una mesa 🙌
Nombre: …
Fecha: sábado 21/11 · Hora: 1:00 pm
Personas: 6
Comentario: cumpleaños
```

### Pedido por WhatsApp
- Carrito con los platos, cantidades y total.
- El cliente elige **recojo en local** o **delivery** (con dirección y referencia).
- Se muestra el número de **Yape** con botón para copiarlo; el cliente envía la captura por el mismo chat.
- El pedido se envía como mensaje ya escrito con `https://wa.me/51978382572?text=...`.

---

## 4. Carta en Google Sheets

La hoja de cálculo es la **única fuente de la carta**. El restaurante edita la hoja y la web se actualiza sola: muestra los platos por categoría y alimenta el armado interactivo del pedido. La web no enlaza ni muestra el PDF.

- **Pestaña `Carta`:** Categoría · Plato · Descripción · Precio · Origen (Sierra / Selva / Fusión / vacío) · Destacado (sí/no) · Popular (sí/no) · Disponible (sí/no).
- **Pestaña `Promo`:** Título · Descripción · Precio · Vigencia.
- La hoja se publica como CSV y la web la lee al abrirse.
- Al construir la página se guarda una copia JSON de los datos de la hoja; si Google Sheets no responde, la web usa esa copia.
- Las filas con precio vacío o inválido se omiten.
- **Carga inicial (una sola vez):** los platos, precios y descripciones se transcriben desde el PDF actual a la hoja, y las fotos se extraen del PDF. Después de eso el PDF ya no se usa.

---

## 5. Especificaciones técnicas

### Stack
- **Astro** como base (HTML estático; solo se envía JavaScript a las islas interactivas).
- **React 19** solo dentro de las islas.
- **Tailwind CSS 4** con tema propio (no valores por defecto).
- **Motion (Framer Motion)** con `LazyMotion` / `m`.
- **TypeScript**.
- Componentes animados de **RareUI** (React + Tailwind + Framer Motion, se copian al código y se adaptan).

### Islas interactivas
| Componente | Carga |
|---|---|
| Carta + carrito + pedido | `client:visible` |
| Formulario de reserva | `client:visible` |
| Indicador "Abierto ahora" | `client:idle` |
| Animaciones de RareUI | `client:visible` |

### Criterio para RareUI y animaciones
- **Sí:** revelado de texto y secciones al hacer scroll, carruseles deslizables de platos, marquesinas de categorías, contadores animados, galerías de fotos, microinteracciones de botones.
- **No:** glassmorphism, brillos, partículas, bordes con resplandor, degradados de neón, animaciones infinitas.
- Duraciones de 150 a 400 ms; solo `transform` y `opacity`.
- Respetar `prefers-reduced-motion`.

### Recorrido pensado para retener
1. Portada con el título revelado palabra por palabra.
2. Promo de la semana inmediatamente después.
3. Carrusel deslizable de platos estrella con botón "Agregar".
4. "La fusión": el scroll pasa de la sierra a la selva (fotos y colores).
5. Contadores: +70 platos y calificaciones.
6. Carrito con contador que rebota y barra inferior con el total.

### Evitar el "diseño de IA"
- Nada de degradados morados/azules, Inter en todo, vidrio esmerilado, tres tarjetas iguales en fila, íconos genéricos ni frases de marketing vacías.
- Fotos reales como protagonistas.
- Composición variada (fotos que se salen de la columna, carta como lista).
- Textos cortos con la voz del restaurante.
- Identidad tomada de la carta existente (ver §6).

### Rendimiento, SEO y accesibilidad
- Lighthouse móvil ≥ 90; LCP < 2,5 s en 4G; JavaScript inicial < 80 KB comprimido.
- Imágenes con `astro:assets` (AVIF/WebP, varios tamaños).
- Schema.org `Restaurant` (dirección, horarios, teléfono, carta, rango de precios).
- Open Graph para la vista previa en WhatsApp e Instagram.
- Buen contraste y botones de al menos 44 px.

### Hosting, dominio y mantenimiento
- **Cloudflare Pages** (gratis, HTTPS, publicación automática desde GitHub).
- **Dominio** `.pe` o `.com`, registrado a nombre del restaurante; Patrick con acceso de administración. El restaurante no tiene dominio ni hosting todavía.
- **Cloudflare Web Analytics**, más eventos para Reservar, Pedir y Cómo llegar.
- El mantenimiento del código lo propone y realiza Patrick.

---

## 6. Identidad visual

Basada en la carta actual (hecha en Canva por Oscar Ocampo) y en fotos del local.

### Colores
| Nombre | Hex | Origen | Uso propuesto |
|---|---|---|---|
| Laguna | `#134948` | Bandas y bordes de la carta | Primario: bandas de sección, títulos, botones |
| Oro | `#F8A028` | Logo y adornos | Acento: CTA, separadores, detalles |
| Yuca | `#F8E8B8` | Títulos sobre fondo oscuro | Texto sobre laguna/selva, fondos suaves |
| Selva noche | `#0C1A12` | Portada con hojas | Fondo oscuro de portada y secciones |
| Papel | `#FFFEFA` | Fondo de las páginas de la carta | Fondo claro principal |
| Achiote | `#8F3038` | Mantas andinas, flores del patio | Etiqueta "Sierra", detalles |
| Toldo | `#21B5A9` | Toldo del patio | Etiqueta "Selva", usar con medida |
| Madera | `#855A37` | Tablas y sillas | Neutro cálido |

**Etiquetas de origen** (la carta ya las usa):
- Sierra → `bg-sierra-fondo text-sierra-texto`
- Selva → `bg-selva-fondo text-selva-texto`
- Fusión → `bg-fusion-fondo text-fusion-texto`
- La más popular → `border border-popular-borde text-popular-texto` con fondo transparente y el texto "✦ La más popular". No usa los colores de Fusión (se confundirían) ni relleno laguna (regla 2).
- Agotado hoy → `bg-fondo-alterno text-texto-suave border border-borde-fuerte`

(Los valores de cada modo están en "Modo noche y colores por función".)

La carta del bar (morada y fucsia) y la página de Yape no siguen esta línea; en la web se adaptan a la paleta.

### Tipografía
| Uso | Carta actual | Propuesta web |
|---|---|---|
| Logo | ArtNuvo (art nouveau) | Logo como imagen SVG/PNG |
| Títulos | Luthier, Bebas Neue | **Young Serif** |
| Texto y precios | Luthier, Montserrat | **Albert Sans** (cifras tabulares en precios) |

### Elementos gráficos existentes
- Logo: "EL CHACHAPOYANO / RESTAURANTE" con el sarcófago de Karajía en la letra "A", círculo dorado y laureles.
- Separadores dorados con ✦ entre líneas.
- Bandas verde laguna con el título en crema (encabezados de categoría).
- Retícula de hexágonos (portada de la carta).
- Mantas andinas de franjas rojas, naranjas y amarillas (aparecen en casi todas las fotos de platos).
- Inspiración adicional: frisos de rombos de Kuélap (sierra), hojas de selva (amazonía).

### Tema de Tailwind 4 (definitivo)

#### Escalas de color
Se generaron en OKLCH a partir de los colores de la carta, manteniendo el tono y bajando la saturación en los extremos. El color original queda exacto en su paso:

| Escala | Color original | Paso | Para qué se usa |
|---|---|---|---|
| `laguna` | `#134948` | 800 | Primario: bandas, títulos, botón principal (hover en 700), bordes en 200 |
| `oro` | `#F8A028` | 300 | Acento: CTA sobre fondo oscuro, separadores; fondos suaves en 100 |
| `achiote` | `#8F3038` | 700 | Etiqueta Sierra, detalles cálidos |
| `toldo` | `#21B5A9` | 400 | Etiqueta Selva, indicador "Abierto ahora" |
| `musgo` | — | — | Neutro con tinte de laguna: texto secundario (600), bordes (200), separadores |

`papel`, `yuca`, `selva` y `madera` son fijos (sin escala).

**Contraste verificado (WCAG):**
| Combinación | Contraste |
|---|---|
| `yuca` sobre `laguna-800` | 8.3 : 1 |
| `oro-300` sobre `laguna-800` | 4.9 : 1 (solo texto ≥ 16 px o adornos) |
| `laguna-800` sobre `papel` | 10.0 : 1 |
| `musgo-600` sobre `papel` (texto secundario) | 5.4 : 1 |
| `oro-950` sobre `oro-300` (botón dorado) | 8.5 : 1 |
| `papel` sobre `laguna-700` (hover del botón) | 7.5 : 1 |
| `yuca` / `oro-300` sobre `selva` | 14.7 : 1 / 8.6 : 1 |
| Etiquetas Sierra / Selva / Fusión | 9.2 / 8.7 / 8.9 : 1 |

#### Radios
La carta es clásica y de esquinas rectas (bandas y marcos), así que los radios son contenidos. Nada de esquinas muy redondeadas por defecto.

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 4 px | Bandas de categoría, miniaturas, campos pequeños |
| `rounded-md` | 8 px | Botones, inputs del formulario de reserva |
| `rounded-lg` | 14 px | Tarjeta de promo, fotos, tarjetas del carrusel |
| `rounded-xl` | 24 px | Panel del carrito (bordes superiores) y barra fija inferior |
| `rounded-full` | — | Etiquetas de origen, contador del carrito, punto de "Abierto ahora" |

#### Sombras
La página es plana por defecto. Las sombras tienen el tinte de `selva` (no gris) y solo indican elevación real.

| Token | Uso |
|---|---|
| sin sombra | Secciones, lista de la carta, bandas, textos |
| `shadow-sm` | Tarjetas del carrusel en reposo |
| `shadow-md` | Tarjeta de promo, fotos que se salen de la columna, tarjeta al pasar el dedo/cursor |
| `shadow-lg` | Solo elementos flotantes: barra fija inferior, panel del carrito, aviso "Agregado" |

#### Movimiento
- `ease-salida` para apariciones y transiciones (150–400 ms).
- `ease-rebote` solo para el contador del carrito al agregar un plato.

#### Código del tema
Va en `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  /* Se eliminan los valores por defecto de Tailwind: solo existen los de la marca */
  --color-*: initial;
  --radius-*: initial;
  --shadow-*: initial;

  /* Colores fijos */
  --color-papel: #FFFEFA;
  --color-yuca: #F8E8B8;
  --color-selva: #0C1A12;
  --color-madera: #855A37;
  --color-blanco: #FFFFFF;

  /* Escalas (el tono original de la carta está marcado en la tabla de arriba) */
  --color-laguna-50: #F0F9F8;
  --color-laguna-100: #DEEFEF;
  --color-laguna-200: #BDDEDC;
  --color-laguna-300: #95C5C3;
  --color-laguna-400: #71ABA9;
  --color-laguna-500: #538F8E;
  --color-laguna-600: #387573;
  --color-laguna-700: #235D5C;
  --color-laguna-800: #134948;
  --color-laguna-900: #083231;
  --color-laguna-950: #011D1D;

  --color-oro-50: #FFF5EB;
  --color-oro-100: #FFE7CE;
  --color-oro-200: #FFCB94;
  --color-oro-300: #F8A028;
  --color-oro-400: #DA8A12;
  --color-oro-500: #B6720A;
  --color-oro-600: #935A04;
  --color-oro-700: #744704;
  --color-oro-800: #5C3600;
  --color-oro-900: #402400;
  --color-oro-950: #271300;

  --color-achiote-50: #FFF4F3;
  --color-achiote-100: #FFE4E3;
  --color-achiote-200: #FEC5C5;
  --color-achiote-300: #FD9B9C;
  --color-achiote-400: #E8777B;
  --color-achiote-500: #CC585F;
  --color-achiote-600: #AD3C46;
  --color-achiote-700: #8F3038;
  --color-achiote-800: #741824;
  --color-achiote-900: #530A15;
  --color-achiote-950: #350108;

  --color-toldo-50: #E9FCF9;
  --color-toldo-100: #CEF5EF;
  --color-toldo-200: #9DE6DD;
  --color-toldo-300: #5BD1C5;
  --color-toldo-400: #21B5A9;
  --color-toldo-500: #0C978D;
  --color-toldo-600: #047971;
  --color-toldo-700: #046059;
  --color-toldo-800: #024A45;
  --color-toldo-900: #00332F;
  --color-toldo-950: #001E1B;

  --color-musgo-50: #EEFAF9;
  --color-musgo-100: #E3EEED;
  --color-musgo-200: #CDD8D8;
  --color-musgo-300: #B2BDBD;
  --color-musgo-400: #96A1A0;
  --color-musgo-500: #778786;
  --color-musgo-600: #5E6C6C;
  --color-musgo-700: #475655;
  --color-musgo-800: #354342;
  --color-musgo-900: #212E2E;
  --color-musgo-950: #0E1B1B;

  /* Tipografía */
  --font-display: "Young Serif", serif;
  --font-sans: "Albert Sans Variable", "Albert Sans", system-ui, sans-serif; /* @fontsource-variable registra "Albert Sans Variable" */

  /* Radios */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 24px;

  /* Sombras (tinte de selva, no gris neutro) */
  --shadow-sm: 0 1px 2px rgb(12 26 18 / 0.08);
  --shadow-md: 0 6px 16px -4px rgb(12 26 18 / 0.14), 0 2px 4px rgb(12 26 18 / 0.06);
  --shadow-lg: 0 18px 40px -10px rgb(12 26 18 / 0.28), 0 4px 12px rgb(12 26 18 / 0.08);

  /* Movimiento */
  --ease-salida: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-rebote: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Modo noche y colores por función

Los componentes **no usan colores directos** (`bg-papel`, `text-laguna-800`), sino **nombres por función** (`bg-fondo`, `text-texto`). Cada nombre toma un valor distinto en modo claro y en modo noche. El modo noche toma su estilo de la portada de la carta: fondo selva, texto crema y dorado.

#### Tabla de colores por función
| Nombre (clase) | Claro | Noche | Notas |
|---|---|---|---|
| `fondo` | `#FFFEFA` (papel) | `#0C1A12` (selva) | Fondo de la página |
| `fondo-alterno` | `#FDF7E6` | `#15251C` | Secciones alternas |
| `tarjeta` | `#FFFFFF` | `#26392E` | 1,46 : 1 sobre el fondo en noche |
| `tarjeta-hover` | `#FFFFFF` | `#2F4237` | En claro el hover lo marcan el borde y la sombra |
| `borde` | `#CDD8D8` (musgo-200) | `#3B4E43` | Borde fino de tarjetas y separadores |
| `borde-fuerte` | `#96A1A0` (musgo-400) | `#4B5F53` | Borde en hover y de inputs |
| `texto` | `#134948` (laguna-800) | `#F8E8B8` (yuca) | 10,0 : 1 / 10,1 : 1 sobre tarjeta |
| `texto-suave` | `#5E6C6C` (musgo-600) | `#CDD8D8` (musgo-200) | 5,4 : 1 / 8,4 : 1 sobre tarjeta |
| `banda` | `#134948` | `#134948` | Bandas de categoría, igual en ambos modos |
| `banda-texto` | `#F8E8B8` | `#F8E8B8` | 8,3 : 1 |
| `banda-borde` | transparente | `#387573` (laguna-600) | Borde de 1 px; 3,4 : 1 contra el fondo |
| `boton` | `#134948` | `#F8A028` (oro-300) | Botón principal |
| `boton-texto` | `#FFFEFA` | `#271300` (oro-950) | 10,0 : 1 / 8,5 : 1 |
| `boton-hover` | `#235D5C` (laguna-700) | `#FFCB94` (oro-200) | |
| `boton-activo` | `#083231` (laguna-900) | `#DA8A12` (oro-400) | |
| `boton2-borde` / `boton2-texto` | `#134948` | `#F8E8B8` | Botón secundario: solo contorno |
| `boton2-hover` | `#F0F9F8` (laguna-50) | `#2F4237` | Fondo del secundario en hover |
| `acento` | `#F8A028` | `#F8A028` | Solo adornos: separadores ✦, líneas |
| `enlace` | `#235D5C` (laguna-700) | `#95C5C3` (laguna-300) | 7,5 : 1 / 9,4 : 1 |
| `foco` | `#387573` (laguna-600) | `#F8A028` (oro-300) | Anillo de foco de teclado, 5,3 : 1 / 5,9 : 1 |
| `abierto` | `#047971` (toldo-600) | `#5BD1C5` (toldo-300) | Indicador "Abierto ahora" |
| `cerrado` | `#8F3038` (achiote-700) | `#FD9B9C` (achiote-300) | Indicador "Cerrado ahora" (lo pide el diseño de la landing); 7,9 : 1 sobre papel / 8,8 : 1 sobre selva |
| `popular-borde` | `#B6720A` (oro-500) | `#F8A028` (oro-300) | Contorno de "✦ La más popular"; 3,9 : 1 sobre blanco / 5,9 : 1 sobre tarjeta. En claro no se usa oro-300 (2,1 : 1) |
| `popular-texto` | `#5C3600` (oro-800) | `#FFCB94` (oro-200) | 10,6 : 1 / 8,3 : 1 |
| `sierra-fondo` / `sierra-texto` | achiote-100 / achiote-800 | achiote-900 / achiote-200 | |
| `selva-fondo` / `selva-texto` | toldo-100 / toldo-800 | toldo-900 / toldo-200 | |
| `fusion-fondo` / `fusion-texto` | oro-100 / oro-800 | oro-900 / oro-200 | |

#### Reglas
1. **El dorado relleno se reserva para la acción principal.** En modo noche solo llevan fondo dorado "Reservar mesa", "Enviar pedido" y el botón principal de la barra fija; como máximo uno visible por pantalla. "Agregar", "Ver la carta", "Cómo llegar" y similares usan el botón secundario (contorno). El dorado sí se usa en adornos finos (separadores, líneas), donde no compite con el botón.
2. **El verde laguna solo en bloques grandes en modo noche.** Las bandas de categoría son la única superficie laguna. Dentro de las tarjetas y en elementos pequeños (etiquetas, íconos, chips) no se usa relleno laguna, para que no convivan dos familias de verde en poco espacio; ahí se usan crema, dorado, toldo y achiote.
3. **La elevación en modo noche se marca con el tono, no con sombra.** Tarjetas más claras que el fondo y con borde fino; sombra negra (`rgb(0 0 0 / 0.45)`) solo en elementos flotantes.
4. **Texto de descripciones:** mínimo 14 px, peso 400. En modo noche no se sube el peso: el texto claro sobre fondo oscuro ya se ve más grueso.
5. **Nunca usar `opacity` para atenuar texto.** Siempre `texto-suave`.
6. **Las fotos no se modifican** en modo noche (sin filtros ni oscurecido).

#### Estados interactivos
| Elemento | Hover | Activo (al tocar) | Foco de teclado | Deshabilitado |
|---|---|---|---|---|
| Botón principal | `boton-hover` | `boton-activo` + `scale(0.98)` | anillo 2 px `foco`, separación 2 px | No se usa (ver abajo) |
| Botón secundario | fondo `boton2-hover` | `scale(0.98)` | anillo 2 px `foco` | No se usa |
| Tarjeta de plato | claro: `borde-fuerte` + `shadow-md`; noche: `tarjeta-hover` + `borde-fuerte` | `scale(0.99)` | anillo 2 px `foco` | — |
| Inputs de reserva | `borde-fuerte` | — | anillo 2 px `foco` | — |
| Plato agotado | — | — | — | Ver abajo |

- **Sin botones deshabilitados.** El botón de reserva siempre está activo; si falta un dato, se muestra un mensaje junto al campo. Las horas fuera del horario no aparecen en el selector, así que no hace falta deshabilitarlas.
- **Plato agotado** (`Disponible = no` en la hoja): se muestra al final de su categoría con la etiqueta "Agotado hoy" (`fondo-alterno` + `texto-suave` + borde `borde-fuerte`: 2,7 : 1 en claro, 1,8 : 1 en noche), el nombre y el precio en `texto-suave` y sin botón "Agregar". No se atenúa con `opacity`. Así el cliente sabe que el plato existe y que puede volver otro día.
- Al pasar el dedo no hay hover en celular: el hover es un extra para computadora; el estado activo es el que se ve al tocar.

#### Activación del modo noche
- Por defecto sigue la preferencia del teléfono (`prefers-color-scheme`).
- Un botón sol/luna permite cambiarlo; la elección se guarda en `localStorage` (con `try/catch`).
- Un script corto en el `<head>` pone `data-tema="oscuro"` en `<html>` antes de mostrar la página, para evitar el parpadeo blanco.

#### Código (se agrega a `src/styles/global.css`, después del `@theme`)
```css
@custom-variant dark (&:where([data-tema="oscuro"], [data-tema="oscuro"] *));

:root {
  --fondo: #FFFEFA;        --fondo-alterno: #FDF7E6;
  --tarjeta: #FFFFFF;      --tarjeta-hover: #FFFFFF;
  --borde: #CDD8D8;        --borde-fuerte: #96A1A0;
  --texto: #134948;        --texto-suave: #5E6C6C;
  --banda: #134948;        --banda-texto: #F8E8B8;   --banda-borde: transparent;
  --boton: #134948;        --boton-texto: #FFFEFA;
  --boton-hover: #235D5C;  --boton-activo: #083231;
  --boton2-borde: #134948; --boton2-texto: #134948;  --boton2-hover: #F0F9F8;
  --acento: #F8A028;       --enlace: #235D5C;        --foco: #387573;
  --abierto: #047971;     --cerrado: #8F3038;
  --sierra-fondo: #FFE4E3; --sierra-texto: #741824;
  --selva-fondo: #CEF5EF;  --selva-texto: #024A45;
  --fusion-fondo: #FFE7CE; --fusion-texto: #5C3600;
  --popular-borde: #B6720A; --popular-texto: #5C3600;
  --sombra-flotante: 0 18px 40px -10px rgb(12 26 18 / 0.28), 0 4px 12px rgb(12 26 18 / 0.08);
  color-scheme: light;
}

[data-tema="oscuro"] {
  --fondo: #0C1A12;        --fondo-alterno: #15251C;
  --tarjeta: #26392E;      --tarjeta-hover: #2F4237;
  --borde: #3B4E43;        --borde-fuerte: #4B5F53;
  --texto: #F8E8B8;        --texto-suave: #CDD8D8;
  --banda: #134948;        --banda-texto: #F8E8B8;   --banda-borde: #387573;
  --boton: #F8A028;        --boton-texto: #271300;
  --boton-hover: #FFCB94;  --boton-activo: #DA8A12;
  --boton2-borde: #F8E8B8; --boton2-texto: #F8E8B8;  --boton2-hover: #2F4237;
  --acento: #F8A028;       --enlace: #95C5C3;        --foco: #F8A028;
  --abierto: #5BD1C5;     --cerrado: #FD9B9C;
  --sierra-fondo: #530A15; --sierra-texto: #FEC5C5;
  --selva-fondo: #00332F;  --selva-texto: #9DE6DD;
  --fusion-fondo: #402400; --fusion-texto: #FFCB94;
  --popular-borde: #F8A028; --popular-texto: #FFCB94;
  --sombra-flotante: 0 18px 40px -10px rgb(0 0 0 / 0.6), 0 4px 12px rgb(0 0 0 / 0.3);
  color-scheme: dark;
}

@theme inline {
  --color-fondo: var(--fondo);               --color-fondo-alterno: var(--fondo-alterno);
  --color-tarjeta: var(--tarjeta);           --color-tarjeta-hover: var(--tarjeta-hover);
  --color-borde: var(--borde);               --color-borde-fuerte: var(--borde-fuerte);
  --color-texto: var(--texto);               --color-texto-suave: var(--texto-suave);
  --color-banda: var(--banda);               --color-banda-texto: var(--banda-texto);
  --color-banda-borde: var(--banda-borde);
  --color-boton: var(--boton);               --color-boton-texto: var(--boton-texto);
  --color-boton-hover: var(--boton-hover);   --color-boton-activo: var(--boton-activo);
  --color-boton2-borde: var(--boton2-borde); --color-boton2-texto: var(--boton2-texto);
  --color-boton2-hover: var(--boton2-hover);
  --color-acento: var(--acento);             --color-enlace: var(--enlace);
  --color-foco: var(--foco);                 --color-abierto: var(--abierto);
  --color-cerrado: var(--cerrado);
  --color-sierra-fondo: var(--sierra-fondo); --color-sierra-texto: var(--sierra-texto);
  --color-selva-fondo: var(--selva-fondo);   --color-selva-texto: var(--selva-texto);
  --color-fusion-fondo: var(--fusion-fondo); --color-fusion-texto: var(--fusion-texto);
  --color-popular-borde: var(--popular-borde); --color-popular-texto: var(--popular-texto);
  --shadow-flotante: var(--sombra-flotante);
}
```

### Material disponible
- **Carta en PDF** (17 páginas, Canva, abril 2024) con **32 fotos en alta resolución** (hasta 6000 px) que se pueden extraer.
- Fotos del local: patio con toldo turquesa, flores rojas y plantas; interior con muro verde, cuadro de Chachapoyas, mantas andinas y pizarra.

---

## 7. Pendientes

1. **Nombre:** el PDF se titula "Carta La Retama", la pizarra dice "La Retama Rest Chachapoyano" y hay un plato "Chaufa a la Retama". Confirmar si la web usa solo "El Chachapoyano".
2. **Portada vigente de la carta:** mármol verde con hexágonos o fondo de hojas de selva.
3. **Logo en SVG o PNG transparente**, exportado desde Canva.
4. **Enlace directo a las reseñas de Google.**
5. **Elegir los componentes concretos de RareUI.**
6. **Carga inicial de la hoja de Google Sheets:** transcribir los platos del PDF y extraer las fotos.
7. **Comprar dominio** y configurar Cloudflare Pages.

---

## 8. Cómo ejecutar el tema (instrucciones para la sesión de código)

**Objetivo:** dejar el tema de §6 aplicado en el proyecto Astro, con modo claro y modo noche, de modo que solo existan los colores, radios y sombras de la marca.

**Pasos:**
1. Copiar en `src/styles/global.css` el bloque `@theme` de "Código del tema" y, a continuación, el bloque de "Modo noche y colores por función", tal cual.
2. Cargar las fuentes Young Serif y Albert Sans (Google Fonts o `@fontsource`), con `font-display: swap`.
3. En el `<body>`: `bg-fondo text-texto font-sans`. Títulos con `font-display`. Precios con `tabular-nums`.
4. **Los componentes usan solo los nombres por función** (`bg-tarjeta`, `text-texto-suave`, `border-borde`, `bg-boton`, `ring-foco`, `bg-sierra-fondo`…). Las escalas (`laguna-*`, `oro-*`, `musgo-*`, etc.) solo se usan para definir esos nombres. Excepción: adornos que deben ser iguales en ambos modos.
5. Agregar el script del `<head>` que aplica `data-tema="oscuro"` según `localStorage` o `prefers-color-scheme`, y el botón sol/luna.
6. Aplicar los estados interactivos de la tabla de §6 y la regla del plato agotado.
7. Reemplazar en los componentes (incluidos los de RareUI) cualquier clase de la paleta por defecto (`gray-*`, `slate-*`, `zinc-*`, `neutral-*`, `stone-*`, `white`, `black`, `rounded-2xl`, `rounded-3xl`, `shadow-xl`, `shadow-2xl`, etc.) por los nombres por función.
8. Crear una página interna `/tema` (solo en desarrollo) que muestre, en ambos modos lado a lado: los colores por función, las etiquetas de origen, el botón principal y el secundario con sus estados, una tarjeta de plato normal y una agotada, una banda de categoría, los radios y las sombras.

**Criterios de aceptación:**
- `npm run build` termina sin errores.
- Una búsqueda de `gray-|slate-|zinc-|neutral-|stone-|bg-white|bg-black|text-white|text-black|rounded-2xl|rounded-3xl|shadow-xl|shadow-2xl` en `src/` no devuelve resultados.
- Fuera de `global.css`, no hay clases con escalas directas (`laguna-`, `oro-`, `achiote-`, `toldo-`, `musgo-`) salvo adornos documentados.
- No se usa `opacity` para atenuar texto.
- En modo noche hay como máximo un botón dorado relleno visible por pantalla.
- Al recargar la página en modo noche no hay parpadeo blanco.
- Las combinaciones de texto usadas están en las tablas de §6; si se usa otra, debe cumplir 4.5 : 1 (o 3 : 1 para texto de 24 px o más).
- Si el diseño necesita un tono o un nombre por función que no está en §6, se agrega primero al documento y después al código.
