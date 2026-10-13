# Haggle

> Your side of the deal.

An AI shopping and deal assistant: paste a link or say what you want, see the **true final price**
across stores (shipping, tax, coupons), get an honest **Buy now / Wait** verdict, and set a price alert.

## Status
**Phase 1: design system.** Tokens, core components, the mascot placeholder, and a living
style-guide screen (the app currently opens on it).

## Run it
```bash
npm install
npx expo start          # press i / a for a simulator, w for web
npm test                # jest
npm run typecheck
npx expo lint
```
Phase 1 runs in Expo Go. Rive (Phase 3+) will need a development build.

## Layout
```
src/
  app/                  Expo Router screens (_layout, styleguide)
  theme/                tokens: colors, typography, spacing/radii/depth, motion
  components/           Text, Icon, PressableSurface, Button, Card, Chip, Badge,
                        Verdict, Skeleton, CountUp, Confetti, ToggleRow, LoadingDots
  components/mascot/    Mascot API, placeholder renderer, event→mood store
  motion/               useReduceMotion, StaggerIn
  feedback/             one haptic (+ optional sound) per meaning
  state/                persisted settings (Zustand + AsyncStorage)
docs/mascot-rive-spec.md
```

## Rules the code follows
- **Tokens everywhere.** No raw hex or font names in components.
- **Accent colors as text** use the `*Text` shades; AA contrast is enforced by `contrast.test.ts`.
- **Never color alone.** Verdicts, badges, toggles and chips always carry an icon or word.
- **Feedback goes through `feedback(meaning)`**: `select` · `success` · `warning` · `error`.
  Sound is off by default and never plays for taps.
- **Reduce Motion** = OS setting OR in-app toggle. Movement becomes fades; nothing is lost.
- **The mascot reacts to events** (`emitMascot('dealFound')`); screens never set a mood directly.
