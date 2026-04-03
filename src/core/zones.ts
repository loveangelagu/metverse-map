export interface ZoneConfig {
  key: string
  x: number
  y: number
  w: number
  h: number
  color: number | string
  label: string
  emoji?: string
}

// Default zones (Terra Flow 9 venue)
export const DEFAULT_ZONES: ZoneConfig[] = [
  { key: 'main_stage', x: 50, y: 100, w: 620, h: 148, color: 0xe08878, label: 'Main Stage', emoji: '\u{1F3A4}' },
  { key: 'bar', x: 50, y: 322, w: 200, h: 148, color: 0xa8d8a8, label: 'Bar', emoji: '\u{1F378}' },
  { key: 'lounge', x: 290, y: 310, w: 380, h: 164, color: 0xa8c8e8, label: 'Lounge', emoji: '\u{1F6CB}' },
  { key: 'shops', x: 50, y: 545, w: 150, h: 416, color: 0xe8a8a8, label: 'Shops', emoji: '\u{1F6CD}' },
  { key: 'networking', x: 240, y: 545, w: 440, h: 268, color: 0xc0a8e0, label: 'Networking', emoji: '\u{1F91D}' },
  { key: 'courtyard', x: 300, y: 892, w: 340, h: 164, color: 0xe0c8a0, label: 'Courtyard', emoji: '\u{1F333}' },
]

export const WORLD_W = 720
export const WORLD_H = 1140

/** Convert zone array to a bounds record keyed by zone key */
export function zonesToBounds(zones: ZoneConfig[]): Record<string, ZoneConfig> {
  return Object.fromEntries(zones.map(z => [z.key, z]))
}

/** Get all zone keys from a zone config array */
export function getZoneNames(zones: ZoneConfig[]): string[] {
  return zones.map(z => z.key)
}

/** Get a zone color as a CSS hex string */
export function zoneColorToCSS(color: number | string): string {
  if (typeof color === 'string') return color
  return `#${color.toString(16).padStart(6, '0')}`
}

/** Get a zone color as a PixiJS hex number */
export function zoneColorToHex(color: number | string): number {
  if (typeof color === 'number') return color
  return parseInt(color.replace('#', ''), 16)
}

export function getSpawnPosition(zones: ZoneConfig[], zoneKey: string): { x: number; y: number } {
  const zone = zones.find(z => z.key === zoneKey) ?? zones[0]
  const margin = 20
  return {
    x: zone.x + margin + Math.random() * (zone.w - margin * 2),
    y: zone.y + margin + Math.random() * (zone.h - margin * 2),
  }
}
