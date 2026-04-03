import { useState, useEffect, useRef, useCallback } from 'react'
import { GameCanvas } from './core/GameCanvas'
import { DEFAULT_PARTICIPANTS } from './core/participants'
import { generateStory } from './core/interactionStories'
import { WORLD_ASPECT_RATIO, WORLD_TOP_OFFSET } from './core/constants'
import { ActivityPanel } from './panels/ActivityPanel'
import { loadVT323Font } from './font'
import type { MetVerseMapProps, ActivityItem } from './types'
import type { Participant } from './core/participants'

const MOBILE_BREAKPOINT = 768

const DEFAULT_THEME = {
  primary: '#eae7f0',
  accent: '#00d4aa',
  secondary: '#f0a030',
  border: '#70b8e8',
  text: '#2d2d40',
  textMuted: '#6a6a80',
  fontFamily: "'VT323', monospace",
}

export function MetVerseMap({
  theme,
  headerText = 'Community Map',
  participants,
  zones,
  stats,
  activities: activitiesProp,
  interactionStories,
  width = '100%',
  height = 'auto',
  minHeight = 400,
  showActivityPanel = true,
  showStats = true,
  onAvatarClick,
  onInteraction,
  onZoneChange,
  onReady,
}: MetVerseMapProps) {
  const t = { ...DEFAULT_THEME, ...theme }
  const containerRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [fontReady, setFontReady] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [canvasDims, setCanvasDims] = useState<{ w: number; h: number } | null>(null)
  const [interactionActivities, setInteractionActivities] = useState<ActivityItem[]>([])
  const eventIdRef = useRef(0)

  const isMobile = containerWidth > 0 && containerWidth < MOBILE_BREAKPOINT
  const resolvedParticipants = participants ?? DEFAULT_PARTICIPANTS

  // Load font
  useEffect(() => {
    console.log('[MetVerseMap] Loading font...')
    loadVT323Font()
      .then(() => { console.log('[MetVerseMap] Font ready'); setFontReady(true) })
      .catch(err => { console.warn('[MetVerseMap] Font failed, continuing anyway:', err); setFontReady(true) })
  }, [])

  // Measure container width for responsive layout
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0
      if (w > 0) setContainerWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fontReady])

  // Measure map container for canvas dimensions
  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      console.log('[MetVerseMap] Measuring map container width:', w)
      if (w === 0) return
      setCanvasDims({ w, h: Math.round(w / WORLD_ASPECT_RATIO) + WORLD_TOP_OFFSET })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // Retry with increasing delays in case layout isn't ready yet
    const timers = [
      setTimeout(measure, 50),
      setTimeout(measure, 150),
      setTimeout(measure, 500),
    ]
    return () => { ro.disconnect(); timers.forEach(clearTimeout) }
  }, [fontReady])

  // Notify ready
  useEffect(() => {
    if (fontReady && canvasDims) onReady?.()
  }, [fontReady, canvasDims, onReady])

  const handleInteraction = useCallback((a: Participant, b: Participant) => {
    const text = generateStory(
      a.name.split(' ')[0],
      b.name.split(' ')[0],
      interactionStories,
    )
    setInteractionActivities(prev => [
      ...prev.slice(-19),
      { user: `@${a.name.split(' ')[0]}`, action: text, target: '' },
    ])
    onInteraction?.(a, b)
  }, [onInteraction, interactionStories])

  // Merge provided activities with interaction-generated ones
  const allActivities = [
    ...(activitiesProp ?? []),
    ...interactionActivities,
  ]

  const cssWidth = typeof width === 'number' ? `${width}px` : width
  const cssHeight = typeof height === 'number' ? `${height}px` : height

  if (!fontReady) {
    return (
      <div style={{
        width: cssWidth,
        minHeight,
        background: t.primary,
        border: `3px solid ${t.border}`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: t.textMuted,
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: cssWidth,
        height: cssHeight === 'auto' ? undefined : cssHeight,
        minHeight,
        border: `3px solid ${t.border}`,
        boxShadow: `3px 3px 0 ${t.border}`,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: t.fontFamily,
        boxSizing: 'border-box',
      }}
    >
      {/* Header bar */}
      <div style={{
        height: 42,
        background: t.border,
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{
          color: '#fff',
          fontSize: 18,
          letterSpacing: '1.5px',
          fontWeight: 'bold',
          fontFamily: t.fontFamily,
        }}>
          {headerText}
        </span>
        <span style={{
          marginLeft: 'auto',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          fontFamily: t.fontFamily,
        }}>
          {resolvedParticipants.length} online
        </span>
      </div>

      {/* Content area: Map + Activity */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        {/* Map canvas */}
        <div
          ref={mapContainerRef}
          style={{
            flex: isMobile ? 'none' : '3 1 0%',
            width: isMobile ? '100%' : undefined,
            height: canvasDims ? canvasDims.h : 300,
            position: 'relative',
            overflow: 'hidden',
            background: '#e8e4d8',
          }}
        >
          {canvasDims && (
            <GameCanvas
              participants={resolvedParticipants}
              onAvatarClick={onAvatarClick ?? (() => {})}
              onInteraction={handleInteraction}
              onZoneChange={onZoneChange}
              viewW={canvasDims.w}
              height={canvasDims.h}
              zones={zones}
            />
          )}
        </div>

        {/* Activity panel */}
        {showActivityPanel && (
          <div style={{
            flex: isMobile ? 'none' : '1 1 0%',
            minWidth: isMobile ? undefined : 200,
            maxWidth: isMobile ? undefined : 350,
            height: isMobile ? 200 : undefined,
            overflow: 'hidden',
          }}>
            <ActivityPanel
              activities={allActivities}
              stats={stats}
              showStats={showStats}
              theme={theme}
              layout={isMobile ? 'bottom' : 'side'}
            />
          </div>
        )}
      </div>
    </div>
  )
}
