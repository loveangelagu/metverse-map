import type { Participant } from './core/participants'
import type { ZoneConfig } from './core/zones'

export type { Participant, ZoneConfig }

export interface MetVerseMapTheme {
  /** Background color (default: '#eae7f0') */
  primary?: string
  /** Highlight/accent color for active elements (default: '#00d4aa') */
  accent?: string
  /** Secondary accent color (default: '#f0a030') */
  secondary?: string
  /** Window border color (default: '#70b8e8') */
  border?: string
  /** Primary text color (default: '#2d2d40') */
  text?: string
  /** Secondary/muted text color (default: '#6a6a80') */
  textMuted?: string
  /** Font family (default: "'VT323', monospace") */
  fontFamily?: string
}

export interface ActivityItem {
  /** Display name, e.g. '@RyoNomad' */
  user: string
  /** Action text, e.g. 'found collab via' */
  action: string
  /** Highlighted target, e.g. 'Nomeo' */
  target: string
}

export interface CommunityStats {
  members?: number
  activeNow?: number
  districts?: number
}

export interface MetVerseMapProps {
  // Theming
  theme?: MetVerseMapTheme
  headerText?: string

  // Data
  participants?: Participant[]
  zones?: ZoneConfig[]
  stats?: CommunityStats
  activities?: ActivityItem[]

  // Custom interaction stories ({A} and {B} placeholders)
  interactionStories?: string[]

  // Sizing
  width?: number | string
  height?: number | string
  minHeight?: number

  // Panels
  showActivityPanel?: boolean
  showStats?: boolean

  // Callbacks
  onAvatarClick?: (participant: Participant) => void
  onInteraction?: (a: Participant, b: Participant) => void
  onZoneChange?: (zoneKey: string) => void
  onReady?: () => void
}
