---
name: Nutfruit Thailand Brand Guidelines
description: Colores, fuentes, elementos visuales y reglas de diseño para todos los videos de Nutfruit Thailand
type: project
---

# Nutfruit Thailand — Brand Guidelines

## Colores exactos
- Azul principal: `#241e8a`
- Azul oscuro (fondo inicio gradiente): `#241e50`
- Azul medio: `#241e83`
- Púrpura (fin de gradiente): `#491283`
- Rojo: `#ed1d26`
- Amarillo (solo detalles, estrellas, acentos): `#fce406`
- Blanco: `#ffffff`
- Crema (fondo claro CTA): `#fffaf2`

## Gradientes suaves
- `linear-gradient(180deg, #241e50, #241e83)` — fondo escena azul standard
- `linear-gradient(155deg, #241e8a, #491283)` — fondo escena azul-púrpura (escena de info)
- `linear-gradient(180deg, #ffffff, #fffaf2)` — fondo claro (CTA scenes)

## Fuentes (archivos en `public/assets/Thailandia/Fonts/`)
| Uso | Font | Archivo |
|-----|------|---------|
| Titulares occidentales (NUTFRUIT, MYTH, VS, etc.) | Thumpa | `Thumpa.otf` |
| Titulares en tailandés | MartianBThai ExtraBlack | `MartianBThai-ExtraBlack.otf` |
| Todo el resto del texto tailandés | MartianBThai Light | `MartianBThai-Light.otf` |

**Regla crítica**: Palabras occidentales en título → Thumpa. Título en tailandés → MartianBThai ExtraBlack. Texto de cuerpo tailandés → MartianBThai Light.

## Elementos visuales recurrentes
- **Wave band inferior**: forma de ola SVG clipPath en rojo o azul, siempre al fondo
- **Estrellas de 8 puntas**: amarillas o rojas, decorativas en las esquinas
- **Squiggle**: onda decorativa (~140×30px), en amarillo o rojo, debajo de titulares
- **Textura de patrón**: siluetas de nueces/hojas SVG, opacity ~12%, blanca sobre oscuro
- **Textura grain**: ruido fractal SVG, opacity ~7%, mix-blend-mode: soft-light
- **Ribbon/banner rojo**: borderRadius 30-32px, padding 28px, texto blanco ExtraBlack
- **Cards de comida**: fondo blanco, borderRadius 30px, borde de color (amarillo para cashew, rojo para dátil)
- **Divider vertical punteado**: dentro de grids 2×2, línea blanca semitransparente entre columnas
- **Blob orgánico**: forma elíptica con borderRadius "50% 50% / 38% 62%", en rosa claro para fondos CTA

## Ilustraciones CSS de frutos secos
- **Cashew (เม็ดมะม่วงหิมพานต์)**: div con border=22px solid #f4d594, border-radius kidney, rotate 22deg, boxShadow lateral
- **Date fruit (อินทผาลัม)**: div oval, background radial-gradient marrón oscuro `#af552c → #4b241b`
- **Almond**: gradient marrón con forma oval inclinada
- **Question mark**: texto "?" gigante en rgba(36,30,138, 0.22)

## Animaciones de marca
- Titulares: spring scale-in desde 0.5x + opacity fade (damping:14, stiffness:160)
- Ribbons/banners: spring slide-up desde Y+120 (damping:14, stiffness:120)
- Cards de comida: stagger spring desde Y+80 con escala 0.5→1 (damping:12, stiffness:130)
- Stars: spring scale de 0→1, rápido (damping:9, stiffness:220)
- Crossfade entre escenas: 12 frames de overlap

## Estructura típica de un reel
- **Escena 1** (cover/hook): fondo azul, título gigante, ribbon rojo, grid de food chips, wave band rojo
- **Escena 2** (contenido): fondo azul-púrpura, cards de producto, texto descriptivo, frosted glass card
- **Escena 3** (CTA): fondo crema, texto rojo enorme, pill CTA azul, wave band azul
- Duración total: ~14s (432 frames a 30fps)
- Formato: 1080×1920 (reel vertical)

## Footer estándar
- Texto "NUTFRUIT THAILAND" en Thumpa, 36px, letterSpacing:3, blanco
- Posicionado dentro del wave band inferior (bottom:78–90px)

## How to apply
- Siempre cargar las 3 fuentes con `useBrandFonts()` y `delayRender` antes de renderizar
- Paths de fuentes con `staticFile("assets/Thailandia/Fonts/Thumpa.otf")` etc.
- Registrar todas las composiciones de Thailandia en Root.tsx bajo el Folder "NutfruitThailand"
- Nombre de archivo: `NutfruitThailand[NombreVideo].tsx` en `src/compositions/`
