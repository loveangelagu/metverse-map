# @metverse/map

Embeddable 2D community map widget with wandering pixel-art avatars, activity feed, and community stats. Drop it into any website — React apps via npm, or any site via a single `<script>` tag.

## Vibe Coding — just paste this into your AI prompt

If you're using Cursor, Copilot, Claude Code, or any AI coding assistant, paste one of these into your prompt and let it do the rest:

**React / Next.js:**

> Add the @metverse/map community map widget to my app. Install it with `npm install @metverse/map`, then import `MetVerseMap` from `@metverse/map` and render it with headerText, theme colors, stats, and activities props. See https://github.com/anthropics/metverse-map for the full API.

**Any HTML page:**

> Add the MetVerse community map to my page. Load React 18 from unpkg, then load `https://unpkg.com/@metverse/map/dist/widget.global.js`. Use `MetVerseMap.mount(element, options)` to mount it into a container div with headerText, theme, stats, and activities options.

## Quickstart

### React / Next.js

```bash
npm install @metverse/map
```

```tsx
import { MetVerseMap } from '@metverse/map'

function App() {
  return (
    <MetVerseMap
      headerText="CANGGU DISTRICT"
      theme={{
        primary: '#1a1a2e',
        accent: '#00d4aa',
        secondary: '#f0a030',
        border: '#6a28d9',
        text: '#e0e0e0',
        textMuted: '#888',
      }}
      stats={{ members: 247, activeNow: 12, districts: 3 }}
      activities={[
        { user: '@RyoNomad', action: 'found collab via', target: 'Nomeo' },
        { user: '@SaraMoves', action: 'matched through', target: 'Padel Island' },
      ]}
    />
  )
}
```

### Any website (Web Component)

```html
<script src="https://unpkg.com/@metverse/map/dist/widget.global.js"></script>

<metverse-map
  header="CANGGU DISTRICT"
  border-color="#6a28d9"
  accent="#00d4aa"
  primary="#1a1a2e"
  width="100%"
  height="600px">
</metverse-map>
```

### Script tag (imperative)

```html
<div id="map"></div>
<script src="https://unpkg.com/@metverse/map/dist/widget.global.js"></script>
<script>
  MetVerseMap.mount(document.getElementById('map'), {
    headerText: 'CANGGU DISTRICT',
    theme: { primary: '#1a1a2e', accent: '#00d4aa', border: '#6a28d9' },
    stats: { members: 247, activeNow: 12, districts: 3 },
  })
</script>
```

## Props / API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `MetVerseMapTheme` | Pastel theme | Colors and font |
| `headerText` | `string` | `"Community Map"` | Text in the header bar |
| `participants` | `Participant[]` | Demo data | Avatars on the map |
| `zones` | `ZoneConfig[]` | 6 default zones | Custom zone layout |
| `stats` | `CommunityStats` | — | Members, active, districts |
| `activities` | `ActivityItem[]` | — | Activity feed items |
| `interactionStories` | `string[]` | 65 built-in | Custom story templates (`{A}` / `{B}` placeholders) |
| `width` | `string \| number` | `'100%'` | CSS width |
| `height` | `string \| number` | `'auto'` | CSS height |
| `minHeight` | `number` | `400` | Minimum height in px |
| `showActivityPanel` | `boolean` | `true` | Show/hide activity panel |
| `showStats` | `boolean` | `true` | Show/hide stats bar |
| `onAvatarClick` | `(p: Participant) => void` | — | Avatar click callback |
| `onInteraction` | `(a, b: Participant) => void` | — | Interaction callback |

## Theme

```ts
interface MetVerseMapTheme {
  primary?: string    // Background color
  accent?: string     // Highlight/accent color
  secondary?: string  // Secondary accent
  border?: string     // Window border color
  text?: string       // Primary text color
  textMuted?: string  // Muted text color
  fontFamily?: string // Font family
}
```

## Custom Zones

```tsx
<MetVerseMap
  zones={[
    { key: 'deus', label: 'DEUS EX MACHINA', x: 50, y: 100, w: 300, h: 150, color: '#00d4aa', emoji: '🏠' },
    { key: 'lawn', label: 'THE LAWN', x: 400, y: 300, w: 250, h: 130, color: '#f0a030', emoji: '🌿' },
    { key: 'batu', label: 'BATU BOLONG', x: 200, y: 500, w: 280, h: 120, color: '#00b8d4', emoji: '🏖️' },
  ]}
/>
```

Zone coordinates are in world space (720x1140). The widget scales everything to fit the container.

## Custom Interaction Stories

```tsx
<MetVerseMap
  interactionStories={[
    '{A} and {B} just discovered they both surf Batu Bolong',
    '{A} invited {B} to tomorrow\'s sunset session',
    '{B} showed {A} the secret path to the rice fields',
  ]}
/>
```

## Layout

- **Desktop (>768px):** 75/25 horizontal split — map on left, activity panel on right
- **Mobile (<768px):** Stacked — map on top, activity panel below

## Web Component Attributes

| Attribute | Maps to |
|-----------|---------|
| `header` | `headerText` |
| `border-color` | `theme.border` |
| `accent` | `theme.accent` |
| `secondary` | `theme.secondary` |
| `primary` | `theme.primary` |
| `text-color` | `theme.text` |
| `text-muted` | `theme.textMuted` |
| `font-family` | `theme.fontFamily` |
| `width` | `width` |
| `height` | `height` |
| `min-height` | `minHeight` |
| `show-activity` | `showActivityPanel` |
| `show-stats` | `showStats` |

For advanced configuration (participants, zones, callbacks), use the JS API:

```js
const el = document.querySelector('metverse-map')
el.setProps({
  participants: [...],
  zones: [...],
  onAvatarClick: (p) => console.log(p.name),
})
```

## Exports

```ts
// Main component
import { MetVerseMap } from '@metverse/map'

// Individual pieces
import { GameCanvas, ActivityPanel, AvatarSprite } from '@metverse/map'
import { DEFAULT_PARTICIPANTS, DEFAULT_ZONES, ARCHETYPE_IDS } from '@metverse/map'
import { generateStory, loadVT323Font } from '@metverse/map'

// Types
import type { MetVerseMapProps, MetVerseMapTheme, Participant, ZoneConfig } from '@metverse/map'
```

## CSP Requirements

If your site uses Content Security Policy headers, add these directives for PixiJS v8:

```
worker-src blob: 'self';
script-src 'unsafe-eval';
```

## License

MIT
