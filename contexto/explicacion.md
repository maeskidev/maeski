# Cómo funciona este sitio

## Estructura general

El sitio es un **portfolio/CV de una página** dividido en dos mitades:

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│    Lado izquierdo   │    Lado derecho      │
│    (texto/CV)       │    (shader animado)  │
│    w-1/2            │    w-1/2             │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

- **Lado izquierdo:** texto estático (nombre, experiencia, links). Fondo negro o blanco según el modo.
- **Lado derecho:** animación generada por GPU en tiempo real con WebGL.
- **Botón toggle** (arriba a la derecha del panel izquierdo): cambia entre modo oscuro y claro. El cambio afecta también los colores del shader.

El estado `isDarkMode` con `useState` es el único estado del componente — de él depende todo lo visual.

---

## ¿Qué es el shader de dithering?

### Dithering en términos simples

**Dithering** es una técnica que simula gradientes o texturas usando solo dos colores, distribuyendo puntos o píxeles en patrones. Es el efecto que ves en impresiones antiguas, pantallas de bajo color, o estética retro/pixelada.

Ejemplo visual de dithering:

```
Sin dithering:   Con dithering:
██████░░░░       ██▓▒░░░░░░
██████░░░░  →    █▓▒░░ ░░░░
██████░░░░       ██▓▒░ ░░░░
```

### ¿De dónde viene?

El componente viene de la librería **`@paper-design/shaders-react`**, creada por [Paper Design](https://paper.design). 

Internamente funciona con **WebGL** — el mismo sistema que usan los videojuegos 3D en el navegador. Se ejecuta directamente en la GPU, no en JavaScript, por eso es muy eficiente aunque esté animado constantemente.

El flujo técnico es:
1. El componente `<Dithering>` monta un elemento `<canvas>` en el DOM.
2. Inicializa un contexto WebGL en ese canvas.
3. Compila un **fragment shader** (programa GLSL que corre en la GPU) que calcula el color de cada píxel en cada frame.
4. Una función `requestAnimationFrame` actualiza el tiempo (`u_time`) en cada frame, produciendo la animación.

---

## Parámetros del shader que puedes cambiar

### Colores
```tsx
colorBack="hsl(0, 0%, 0%)"      // color de fondo (zonas "vacías")
colorFront="hsl(320, 100%, 70%)" // color de frente (zonas "llenas")
```
Acepta cualquier string CSS válido: `"red"`, `"#ff00ff"`, `"hsl(...)"`, `"rgb(...)"`.

En el componente actual los colores cambian según `isDarkMode`:
- **Modo oscuro:** fondo negro, frente rosa/magenta
- **Modo claro:** fondo gris claro, frente azul

### Forma (`shape`)
Controla el patrón base que se usa para generar el gradiente antes de dithering:

| Valor | Descripción |
|-------|-------------|
| `"simplex"` | Ruido orgánico, fluido |
| `"warp"` | Ruido distorsionado, más caótico |
| `"dots"` | Puntos circulares |
| `"wave"` | Ondas suaves |
| `"ripple"` | Ondas tipo agua/gotas |
| `"swirl"` | Espiral giratoria |
| `"sphere"` | Esfera 3D iluminada ← *el actual* |

### Tipo de dithering (`type`)
Define el algoritmo de distribución de puntos:

| Valor | Descripción |
|-------|-------------|
| `"random"` | Distribución aleatoria (más ruidosa) |
| `"2x2"` | Matriz Bayer 2×2 (patrón geométrico pequeño) |
| `"4x4"` | Matriz Bayer 4×4 ← *el actual* |
| `"8x8"` | Matriz Bayer 8×8 (patrón más suave y detallado) |

> **¿Qué es una matriz Bayer?** Es una cuadrícula de umbrales fijos que distribuye los puntos en un patrón ordenado y repetitivo. Produce el efecto retro/pixelado clásico.

### Tamaño de píxel (`size`)
```tsx
size={3}  // tamaño de cada "pixel" del dithering (0.5 a 20)
```
> **Nota:** la prop `pxSize` que ves en el código original está **deprecada**. Se puede cambiar por `size` sin problema.

### Animación y posición
```tsx
speed={0.1}      // velocidad de la animación (0 = parado)
scale={0.8}      // zoom del patrón
rotation={0}     // rotación en grados (0–360)
offsetX={0}      // desplazamiento horizontal (-1 a 1)
offsetY={0}      // desplazamiento vertical (-1 a 1)
```

---

## Presets disponibles

La librería incluye presets predefinidos que puedes usar directamente:

```tsx
import {
  defaultPreset,
  sinePreset,
  bugsPreset,
  ripplePreset,
  swirlPreset,
  warpPreset,
} from "@paper-design/shaders-react"
```

Uso:
```tsx
<Dithering {...ripplePreset.params} style={{ height: "100%", width: "100%" }} />
```

---

## Cómo personalizar el componente

El componente está en:
```
src/components/ui/portfolio-hero-with-paper-shaders.tsx
```

### Cambiar el shader a ondas de agua
```tsx
<Dithering
  style={{ height: "100%", width: "100%" }}
  colorBack="hsl(210, 50%, 10%)"
  colorFront="hsl(190, 100%, 70%)"
  shape="ripple"
  type="8x8"
  size={4}
  speed={0.3}
  scale={1}
/>
```

### Hacerlo estático (sin animación)
```tsx
speed={0}
```

### Cambiar colores con variables CSS
```tsx
colorBack="var(--background)"
colorFront="var(--primary)"
```

---

## Archivos clave del proyecto

| Archivo | Qué hace |
|---------|----------|
| `src/app/page.tsx` | Página principal, renderiza `<ResumePage>` |
| `src/app/layout.tsx` | Layout raíz (fuentes, metadata, html/body) |
| `src/app/globals.css` | Variables CSS de shadcn + estilos base de Tailwind |
| `src/components/ui/portfolio-hero-with-paper-shaders.tsx` | El componente completo del portfolio |
| `src/lib/utils.ts` | Utilidad `cn()` para combinar clases de Tailwind |
| `components.json` | Configuración de shadcn/ui |
| `next.config.ts` | Configuración de Next.js |
