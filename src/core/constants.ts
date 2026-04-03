/**
 * MetVerse Map Widget — Central constants
 */

// ─── World / canvas ───────────────────────────────────────────────────────────

export const WORLD_TOP_OFFSET = 10
export const WORLD_ASPECT_RATIO = 720 / 1140
export const CANVAS_BG_HEX = 0xe8e4d8
export const CANVAS_BG_CSS = '#e8e4d8'

// ─── Avatar rendering ─────────────────────────────────────────────────────────

export const BUNNY_SCALE = 1
export const BUNNY_H = 50

// ─── Proximity / interaction ──────────────────────────────────────────────────

export const PROXIMITY = 50
export const GRID_CELL = PROXIMITY
export const MIN_SEP = 60
export const COOLDOWN_MS = 15_000
export const WANDER_CANDIDATES = 6

// ─── Wandering timing (ms) ────────────────────────────────────────────────────

export const WANDER_PAUSE_MIN = 3_000
export const WANDER_PAUSE_RANGE = 4_000

// ─── Interaction display ──────────────────────────────────────────────────────

export const INTERACTION_DURATION_MIN = 2_000
export const INTERACTION_DURATION_RANGE = 1_000

// ─── UI ───────────────────────────────────────────────────────────────────────

export const MAX_FEED_MESSAGES = 20
export const SIDEBAR_WIDTH = 210

// ─── Responsive breakpoints (px) ─────────────────────────────────────────────

export const BREAKPOINTS = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
} as const
