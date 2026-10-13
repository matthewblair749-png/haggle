# Haggle mascot: Rive file spec

The app ships a Reanimated + SVG placeholder (`src/components/mascot/MascotPlaceholder.tsx`)
with the same public API the Rive version must provide. When the `.riv` is ready, swapping is a
one-line change in `src/components/mascot/Mascot.tsx`.

## Character
An original llama named Haggle. Warm sand fur (`#F6DDB8`), cream fleece tuft and chest
(`#FFF6E6`), chunky ink outline (`#1D1D2B`, ~5/200 of artboard width), coral scarf
(`#FF8A3D`) with a small sunshine price-tag charm (`#FFD23F`). Flat shapes, no gradients.
Use the placeholder as the proportion reference (see the style-guide screen). Do not reference
or resemble any existing brand mascot.

## File
- Path: `assets/mascot/haggle.riv`
- Artboard: `Haggle`, square, 400×400, character bottom-anchored with ~4% padding.
- State machine: `HaggleSM`

## Inputs (names are part of the code contract)
| Input          | Type    | Values / notes |
|----------------|---------|----------------|
| `mood`         | Number  | 0 idle · 1 thinking · 2 happy · 3 wink · 4 excited · 5 sad · 6 celebrating · 7 sleeping |
| `reduceMotion` | Boolean | When true: no hops, bobs, tilts or floating; mood changes cross-fade (≤250ms). Blinks may stay. |
| `poke`         | Trigger | Optional tap reaction (small squish + happy glance), returns to the current mood. |

The numeric order matches `moodIndex` in `src/components/mascot/types.ts` and is covered by a unit test.

## States
| Mood | Loop | Notes |
|------|------|-------|
| idle | breathing (1.8s), blink every 2.6–3.8s, ear wiggle every ~3.5s | default |
| thinking | head tilt −7°, eyes up-right, one brow raised, 3 thought dots pulsing | while searching; can last many seconds |
| happy | one hop on entry, then idle loop with a smile | results ready |
| wink | right eye closed, smile, 2 sparkles | good price |
| excited | big eyes, open mouth, ears perked, repeated small hops | deal found |
| sad | ears droop (~55°), brows up in the middle, small frown, slight sink | price went up / error; never over-dramatic |
| celebrating | party hat, ^ ^ eyes, open mouth, bigger hops + side wobble, sparkles | money saved; ~3.6s then app returns to idle |
| sleeping | eyes closed, slow breathing (2.6s), ears down, floating "z" | empty / offline |

Transitions: any → any, 150–300ms blend. Never block on an exit animation; a new `mood`
value must take effect immediately.

## Performance
- Keep under ~60 KB, no raster images, no more than ~40 bones/shapes animated at once.
- Target 60fps on a mid-range Android phone (e.g. Pixel 6a) with 2 instances on screen.

## Swapping it in
1. `npx expo install rive-react-native` (needs a development build; it does not run in Expo Go).
2. Add `MascotRive.tsx` implementing `MascotProps`: map `mood` → `moodIndex[mood]`, pass the
   result of `useReduceMotion()` to `reduceMotion`, keep the same a11y label logic.
3. Change the export in `Mascot.tsx`. Run the tests and check the style-guide screen.
