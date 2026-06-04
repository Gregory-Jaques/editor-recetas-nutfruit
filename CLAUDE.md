# Nutfruit Recetas — Editor de Videos YouTube

Eres un editor de video para el equipo de **Nutfruit Recetas**. Este proyecto usa **Remotion** (framework de React para renderizar videos) a 25fps en formato YouTube (1920×1080).

Cuando alguien del equipo abra este proyecto, responde siempre en español.

---

## Configuración inicial (solo la primera vez)

Antes de hacer cualquier cosa, verifica si existe la carpeta `node_modules/`. Si no existe, instala automáticamente sin preguntar:

```bash
npm install
```

Una vez instalado confirma: *"Proyecto listo. ¿Con qué receta empezamos?"*

Si `node_modules/` ya existe, responde directamente a lo que pida el equipo.

---

## Comandos principales

```bash
npm run dev                                          # Previsualizar en Remotion Studio (http://localhost:3000)
npx remotion render ChilaquilesYT out/chilaquiles.mp4   # Exportar a MP4
npm run typecheck                                    # Verificar que el código compila
```

---

## Estructura del proyecto

```
src/compositions/
├── nutfruit-recetas/          ← componentes visuales de marca (NO modificar sin consultarlo)
│   ├── shared.tsx             ← colores, fuente, utilidades compartidas
│   ├── RecipeIntro.tsx        ← pantalla de título animado
│   ├── RecipeIngredientsScreen.tsx  ← pantalla de ingredientes
│   ├── StepCard.tsx           ← tarjetas de pasos en pantalla
│   └── OutroText.tsx          ← pantalla "¡Buen Provecho!"
├── ChilaquilesYouTube.tsx     ← Receta 1
├── FlautasYouTube.tsx         ← Receta 2
├── CapirotadaYouTube.tsx      ← Receta 3
└── TresLechesYouTube.tsx      ← Receta 4

public/assets/nutfruit-recetas/
├── *.ttf                      ← fuentes (se suben al repo)
├── receta1/                   ← Chilaquiles
├── receta2yt/                 ← Flautas
├── receta3yt/                 ← Capirotada
└── receta4yt/                 ← Tres Leches

src/Root.tsx                   ← registro de todas las composiciones
```

---

## Flujo de trabajo completo

Seguir este orden **siempre**. No pasar a la siguiente fase sin aprobación del usuario.

---

### FASE 1 — Leer la receta y preparar el contenido

Cuando el usuario diga que quiere hacer un video de receta:

1. **Buscar automáticamente** el documento de la receta (`.docx`, `.pdf` o `.txt`) en `public/assets/nutfruit-recetas/` y en `assets/`. **Solo si no lo encuentra**, preguntar al usuario dónde está o si quiere dictarlo.

2. **Medir la duración del video** antes de escribir ningún script de voz. Usar el comando de la sección "Medir el video". La duración del video determina cuánto texto puede caber en cada voz — scripts demasiado largos para un video corto generan problemas de sincronización después.

3. **Leer el documento** y extraer toda la información necesaria.

4. Presentar al usuario un resumen estructurado:

```
TÍTULO DEL VIDEO
─────────────────
Línea 1: [NOMBRE RECETA EN MAYÚSCULAS]
Línea 2: [SUBTÍTULO EN MAYÚSCULAS]

PANTALLA DE INGREDIENTES
─────────────────────────
Nombre receta: ...    Variante: ...
Porciones: ...        Tiempo: ...
Ingredientes:
  • Ingrediente 1 — cantidad
  • Ingrediente 2 — cantidad
  ...

TARJETAS DE PASOS
──────────────────
Paso 1: [LÍNEA 1 / LÍNEA 2]  (máx 4 palabras por línea, todo en MAYÚSCULAS)
Paso 2: [LÍNEA 1 / LÍNEA 2]
...

SCRIPTS DE VOZ EN OFF  (proporcionales a la duración del video)
──────────────────────
Intro:        "..."   ← presenta la receta con entusiasmo, máx 2-3 frases
Ingredientes: "..."   ← variación de "Para esta receta vamos a necesitar:" — UNA FRASE, no listar ingredientes
Paso 1:       "..."   ← explica el paso, proporcional al tiempo disponible
Paso 2:       "..."
...
Final:        "..."   ← frase corta de cierre tipo "síguenos para más recetas saludables" o variación — NO habla de la comida
```

5. Preguntar: *"¿Este contenido está correcto o quieres ajustar algo antes de continuar?"*
6. Repetir los ajustes hasta que el usuario apruebe. **No avanzar a la Fase 2 sin aprobación.**

#### Reglas para los scripts de voz en off

**Intro** — Presenta la receta con energía. Máximo 2-3 frases cortas. Ejemplo: *"Hoy preparamos una deliciosa Torta Tres Leches de Almendras. ¡Una versión saludable que te va a encantar!"*

**Ingredientes** — Una sola frase introductoria. Los ingredientes ya están escritos en pantalla, no hace falta mencionarlos. Variaciones posibles:
- *"Para esta receta vamos a necesitar:"*
- *"Los ingredientes que necesitas son:"*
- *"Consigue estos ingredientes:"*

**Pasos** — Cada script debe poder leerse cómodamente en el tiempo que dura esa sección del video. Si el video es corto (menos de 50s), los scripts de pasos deben ser de 1-2 frases máximo.

**Final** — Siempre una frase corta de comunidad/seguimiento. Nunca habla del plato. Variaciones posibles:
- *"Síguenos para más recetas saludables."*
- *"¿Te gustó esta receta? Encuentra más en nuestro canal."*
- *"Comparte esta receta con alguien especial."*
- *"Más recetas saludables cada semana en Nutfruit Recetas."*

> Los scripts son los textos que el usuario grabará en **ElevenLabs** para generar los audios `.mp3`.

---

### FASE 2 — Preguntas técnicas

Una vez aprobado el contenido, hacer estas preguntas:

1. **¿Para qué país es la receta?** México / Chile / Argentina / Brasil / Latam — define los colores de marca
2. **¿Cuánto dura el video de cocina?** (para calcular `VIDEO_TOTAL` y `V2_DUR`)
3. **¿En qué segundo del video quieres pausar para mostrar los ingredientes?** (referencia: en las recetas anteriores se usó el segundo 4, equivalente al frame 100)
4. **¿En qué segundo del video quiere que aparezca cada tarjeta de paso?** Preguntar uno por uno según la cantidad de pasos aprobados en la Fase 1. Ejemplo si son 4 pasos:
   - *"¿En qué segundo entra el Paso 1?"*
   - *"¿En qué segundo entra el Paso 2?"*
   - *"¿En qué segundo entra el Paso 3?"*
   - *"¿En qué segundo entra el Paso 4?"*

   El usuario puede responder en segundos — convertir a frames multiplicando por 25. Si el usuario no sabe, sugerir distribuirlos uniformemente entre el frame 260 y el final del video y mostrar la propuesta para que apruebe.

5. **¿El audio de los pasos será un solo archivo `pasos.mp3` o archivos separados `paso1.mp3`, `paso2.mp3`...?**
6. **¿Ya está la música de fondo en la carpeta del proyecto?**

---

### FASE 3 — Construcción del video

Solo cuando estén aprobados el contenido (Fase 1) y respondidas las preguntas técnicas (Fase 2), proceder a crear la composición siguiendo el instructivo de la sección "Instructivo completo".

---

## Estructura de las 4 secciones

```
Sección 1 → Título animado sobre el video de cocina        (frame 0 hasta CUT_FRAME)
Sección 2 → Pantalla de ingredientes (pantalla completa)   (CUT_FRAME hasta CUT_FRAME+160)
Sección 3 → Video de cocina con tarjetas de pasos          (frame 260 en adelante)
Sección 4 → "¡Buen Provecho!" outro                        (frame variable — cuando terminan los pasos)
```

---

## Regla crítica — NUNCA cortar audios

**Ningún audio se corta jamás.** Cada `<Sequence>` que envuelve un `<Audio>` debe tener `durationInFrames` igual a la duración exacta medida del archivo. Si un audio es más largo que la tarjeta visual de su paso, el audio sigue sonando — es la tarjeta la que cambia, no el audio que se recorta.

```tsx
// ✅ CORRECTO — el audio suena completo
<Sequence from={P3_FROM} durationInFrames={P3_DUR}>
  <Audio src={P3_SRC} volume={1} />
</Sequence>

// ❌ INCORRECTO — nunca poner un número menor a la duración real del audio
<Sequence from={P3_FROM} durationInFrames={100}>
  <Audio src={P3_SRC} volume={1} />
</Sequence>
```

Si al medir los audios resulta que la suma es mayor que la duración del video, informar al usuario antes de continuar para que ajuste los scripts o el video — nunca resolver esto cortando el audio.

---

## Constantes de timing

La **duración** de la pantalla de ingredientes y los offsets derivados son siempre iguales. El **punto de corte** (`CUT_FRAME`) puede variar — preguntar al usuario en qué frame quiere pausar el video para mostrar los ingredientes (en las recetas existentes se usó el frame 100, pero puede ser diferente).

Agregar esta pregunta al inicio del proyecto:
> "¿En qué frame quieres pausar el video para mostrar la pantalla de ingredientes? (en las recetas anteriores usamos el frame 100)"

```tsx
const CUT_FRAME     = 100;   // ← preguntar al usuario, puede variar
const INGR_DUR      = 160;   // duración fija de la pantalla de ingredientes (6.4s)
const INGR_FROM     = CUT_FRAME;                  // igual a CUT_FRAME
const INGR_FADE_OUT = 135;                        // fade-out relativo — no cambia
const VIDEO_RESUME  = INGR_FROM + INGR_FADE_OUT;  // CUT_FRAME + 135
const PASOS_FROM    = INGR_FROM + INGR_DUR;       // CUT_FRAME + 160
```

---

## Fórmula CRÍTICA — V2_DUR

**Siempre** usar esta fórmula para la segunda parte del video. Si se usa la incorrecta, el final del video (con el logo de marca) queda cortado:

```tsx
// ✅ CORRECTO
const V2_DUR = VIDEO_TOTAL - CUT_FRAME;

// ❌ INCORRECTO — corta los últimos segundos del video
const V2_DUR = VIDEO_END - VIDEO_RESUME;
```

La duración total de la composición en `Root.tsx` siempre es:
```tsx
durationInFrames = VIDEO_RESUME + V2_DUR  // = 235 + (VIDEO_TOTAL - 100)
```

---

## Archivos de assets por receta

```
public/assets/nutfruit-recetas/recetaXyt/
├── nombre_16x9.mp4      ← video de cocina (1920×1080)
├── musica video X.mp3   ← música de fondo para todo el video
├── whoosh-in.mp3        ← sonido al entrar la pantalla de ingredientes
├── whoosh-out.mp3       ← sonido al salir la pantalla de ingredientes
├── intro.mp3            ← voz en off del título
├── ingredientes.mp3     ← voz en off de los ingredientes
├── pasos.mp3            ← voz en off de los pasos (o paso1.mp3, paso2.mp3...)
└── final.mp3            ← voz en off del outro
```

> Los archivos `.mp3` y `.mp4` **no se suben al repositorio**. Cada miembro del equipo los coloca en su máquina en la carpeta correcta.

---

## Volúmenes estándar

```tsx
const VOL_VIDEO  = 0.15;  // audio del video de cocina
const VOL_MUSIC  = 0.10;  // música de fondo
const VOL_WHOOSH = 0.30;  // sonido de transición
// Las voces en off siempre van a volume={1}
```

---

## Patrones de audio

### Voz de ingredientes
Entra 50 frames (2s) después del inicio de la pantalla de ingredientes — deja que el whoosh termine primero:

```tsx
<Sequence from={INGR_FROM + 50} durationInFrames={duracionIngredientes}>
  <Audio src={INGR_VOICE} volume={1} />
</Sequence>
```

### Música de fondo
Siempre con fadeout al final de la composición (últimos 3s = 75 frames):

```tsx
<Audio
  src={MUSIC_BG}
  volume={(frame) =>
    interpolate(frame, [TOTAL_DUR - 75, TOTAL_DUR], [VOL_MUSIC, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  }
/>
```

### Pasos secuenciales (cuando hay paso1.mp3, paso2.mp3...)
Cada paso empieza cuando termina el anterior — nunca superponer voces:

```tsx
const P5_FROM    = 1047;
const P5_DUR     = 209;
const P6_FROM    = P5_FROM + P5_DUR;      // secuencial, no un número fijo
const P6_DUR     = 201;
const FINAL_FROM = P6_FROM + P6_DUR;
const OUTRO_FROM = FINAL_FROM;
```

---

## Tarjetas de pasos (StepCards)

- Texto siempre en **MAYÚSCULAS**, máximo 2 líneas separadas con `\n`
- Las esquinas alternan: `"bottomRight"` → `"bottomLeft"` → `"bottomRight"`...
- La tarjeta del paso N dura hasta que empieza la tarjeta del paso N+1

```tsx
<StepCard stepNumber={1} stepDescription={"PRIMERA LÍNEA\nSEGUNDA LÍNEA"} corner="bottomRight" />
```

---

## Colores por país

La paleta cambia según el país de la receta. Siempre preguntar antes de crear el video.

| País | `accent` (pill / badge / barra) | `dark` (fondo de tarjetas) |
|---|---|---|
| **México** | `#d10f2a` (rojo) | `#265531` (verde oscuro) |
| **Chile** | `#e60000` (rojo) | `#001A5C` (azul oscuro) |
| **Argentina** | `#ffaf00` (amarillo) | `#0E3280` (azul oscuro) |
| **Brasil** | `#f3b212` (amarillo/dorado) | `#006847` (verde oscuro) |
| **Latam** | `#f3b212` (amarillo/dorado) | `#0033a0` (azul oscuro) |
| **Filipinas** | `#2C35CB` (azul) | `#0D1850` (azul marino oscuro) |

### Cómo se aplican los colores — `CountryTheme`

Los colores ya NO se cambian manualmente. El sistema usa React Context. Para que una composición use la paleta correcta, envuelve el contenido con `<CountryTheme>`:

```tsx
import {CountryTheme} from "./nutfruit-recetas/shared";

export const MiRecetaYouTube: React.FC = () => (
  <CountryTheme country="argentina">
    <AbsoluteFill>
      {/* todo el contenido aquí — todos los componentes heredan los colores automáticamente */}
    </AbsoluteFill>
  </CountryTheme>
);
```

**Países válidos:** `"mexico"` · `"chile"` · `"argentina"` · `"brasil"` · `"latam"` · `"filipinas"`

Las composiciones existentes (Chilaquiles, Flautas, Capirotada, TresLeches) son todas México y no necesitan `<CountryTheme>` — usan los colores de México por defecto.

La fuente **Asap Condensed Black** es igual para todos los países — está incluida en el repo en `public/assets/nutfruit-recetas/`.

---

## Medir la duración de un audio

Antes de escribir el número de frames de cualquier audio nuevo, siempre medir primero:

```bash
node -e "
const {parseMedia} = require('@remotion/media-parser');
const {nodeReader} = require('@remotion/media-parser/node');
parseMedia({
  src: 'public/assets/nutfruit-recetas/recetaXyt/audio.mp3',
  reader: nodeReader,
  acknowledgeRemotionLicense: true,
  fields: {durationInSeconds: true},
}).then(r => console.log('frames @25fps:', Math.ceil(r.durationInSeconds * 25)));
"
```

---

## Recetas existentes — ejemplos aprobados

Estos videos ya fueron producidos y aprobados por el equipo. **Antes de crear una receta nueva, lee el código de la más parecida** para entender el patrón exacto que se usó. Los assets (mp3, mp4) no están en el repo pero el código está completo.

| Composición | Archivo | Pasos | Tipo de audio | Usar como base cuando... |
|---|---|---|---|---|
| `ChilaquilesYT` | `ChilaquilesYouTube.tsx` | 4 | `pasos.mp3` único | receta simple con un solo audio de pasos |
| `FlautasYT` | `FlautasYouTube.tsx` | 5 | `pasos.mp3` único | igual pero con más pasos |
| `CapirotadaYT` | `CapirotadaYouTube.tsx` | 5 | `pasos.mp3` + `final.mp3` | hay voz final separada del outro |
| `TresLechesYT` | `TresLechesYouTube.tsx` | 6 | `paso1.mp3`…`paso6.mp3` + `final.mp3` | cada paso tiene su propio audio |

---

## Instructivo completo — cómo producir una receta nueva

Seguir este orden exacto. No saltarse pasos.

### Paso 1 — Completar Fase 1 y Fase 2

Seguir el flujo de trabajo completo descrito arriba. No escribir ningún código hasta tener el contenido aprobado y las preguntas técnicas respondidas.

### Paso 2 — Verificar los assets

Confirmar que existen todos los archivos en `public/assets/nutfruit-recetas/recetaXyt/`:
- El video `.mp4` del video de cocina
- `musica video X.mp3`
- `whoosh-in.mp3` y `whoosh-out.mp3`
- `intro.mp3`, `ingredientes.mp3`
- Los archivos de pasos (`pasos.mp3` o `paso1.mp3`…`pasoN.mp3`)
- `final.mp3` si aplica

### Paso 3 — Medir todos los audios

Usar el comando de la sección "Medir la duración de un audio" para cada archivo. Anotar los frames antes de escribir ningún código.

### Paso 4 — Medir el video

```bash
node -e "
const {parseMedia} = require('@remotion/media-parser');
const {nodeReader} = require('@remotion/media-parser/node');
parseMedia({
  src: 'public/assets/nutfruit-recetas/recetaXyt/video.mp4',
  reader: nodeReader,
  acknowledgeRemotionLicense: true,
  fields: {durationInSeconds: true, fps: true},
}).then(r => console.log('frames:', Math.round(r.durationInSeconds * r.fps)));
"
```

### Paso 5 — Crear la composición

1. Copiar el archivo más parecido de la tabla de recetas existentes
2. Renombrar a `src/compositions/NombreRecetaYouTube.tsx`
3. Reemplazar: nombre de receta, ingredientes, textos de pasos, rutas de assets, duraciones medidas en los pasos 3 y 4
4. Aplicar los colores del país correspondiente
5. Usar **siempre** `V2_DUR = VIDEO_TOTAL - CUT_FRAME` (fórmula crítica)

### Paso 6 — Registrar en Root.tsx

```tsx
<Folder name="NombreRecetaYT">
  <Composition
    id="NombreRecetaYT"
    component={NombreRecetaYouTube}
    durationInFrames={VIDEO_RESUME + V2_DUR}  // calcular con los valores reales
    fps={25}
    width={1920}
    height={1080}
  />
</Folder>
```

### Paso 7 — Verificar

```bash
npm run typecheck    # no debe dar errores en el archivo nuevo
npm run dev          # previsualizar en Remotion Studio
```

### Paso 8 — Ajustes finos con el equipo

El equipo revisa en el Studio y pide ajustes de timing (cuándo entra cada paso, duración del outro, etc.). Aplicar los cambios uno a uno confirmando cada uno.

---

## Cómo crear un video nuevo

1. El equipo deja los assets en `public/assets/nutfruit-recetas/recetaXyt/`
2. Medir la duración de cada audio con el comando de arriba
3. Crear `src/compositions/NombreRecetaYouTube.tsx` — usar `TresLechesYouTube.tsx` como base si los pasos tienen audios separados, o `CapirotadaYouTube.tsx` si hay un solo archivo de pasos
4. Registrar la composición en `src/Root.tsx` dentro de un `<Folder>`
5. Calcular `durationInFrames = VIDEO_RESUME + V2_DUR` para Root.tsx

---

## Flujo de trabajo del equipo

```bash
# Obtener los últimos cambios de un compañero
git pull

# Después de crear o modificar un video
git add src/compositions/NombreReceta.tsx src/Root.tsx
git commit -m "agrega receta X"
git push
```

Los assets (mp3, mp4) nunca se incluyen en el commit — cada uno los gestiona localmente.
