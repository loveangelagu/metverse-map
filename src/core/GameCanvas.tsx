import { useEffect, useRef, useState, useCallback } from 'react'
import type { Participant } from './participants'
import { DEFAULT_ZONES, WORLD_W, WORLD_H, type ZoneConfig, zonesToBounds, zoneColorToHex, getSpawnPosition } from './zones'
import {
  WORLD_TOP_OFFSET,
  PROXIMITY,
  GRID_CELL,
  MIN_SEP,
  COOLDOWN_MS,
  WANDER_CANDIDATES,
  WANDER_PAUSE_MIN,
  WANDER_PAUSE_RANGE,
  INTERACTION_DURATION_MIN,
  INTERACTION_DURATION_RANGE,
} from './constants'
import { ARCHETYPE_IDS, getAllAvatarSVGs, DEFAULT_ARCHETYPE, type ArchetypeId } from './avatars'

const EMOJIS = ['💬']

const BG_COLOR = 0xe8e4d8
const BG_CSS = '#e8e4d8'

interface Props {
  participants: Participant[]
  currentUserId?: string
  matchIds?: Set<string>
  onAvatarClick: (participant: Participant) => void
  onInteraction?: (a: Participant, b: Participant) => void
  onZoneChange?: (zoneKey: string) => void
  viewW?: number
  height?: number
  zones?: ZoneConfig[]
}

export function GameCanvas({ participants, currentUserId, matchIds, onAvatarClick, onInteraction, onZoneChange, viewW, height, zones: zonesProp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const resetZoomRef = useRef<(() => void) | null>(null)
  const onClickRef = useRef(onAvatarClick)
  useEffect(() => { onClickRef.current = onAvatarClick }, [onAvatarClick])

  const onInteractionRef = useRef(onInteraction)
  useEffect(() => { onInteractionRef.current = onInteraction }, [onInteraction])

  const onZoneChangeRef = useRef(onZoneChange)
  useEffect(() => { onZoneChangeRef.current = onZoneChange }, [onZoneChange])

  const participantsRef = useRef(participants)
  useEffect(() => { participantsRef.current = participants }, [participants])

  const currentUserIdRef = useRef(currentUserId)
  useEffect(() => { currentUserIdRef.current = currentUserId }, [currentUserId])

  const matchIdsRef = useRef(matchIds)
  useEffect(() => { matchIdsRef.current = matchIds }, [matchIds])

  useEffect(() => {
    let destroyed = false
    let appReady = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let app: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapRef: any = null
    const stopWandering: Array<() => void> = []
    let proximityInterval: ReturnType<typeof setInterval> | null = null
    let syncInterval: ReturnType<typeof setInterval> | null = null

    async function setup() {
      console.log('[MetVerseMap] GameCanvas setup starting...')
      const PIXI = await import('pixi.js')
      console.log('[MetVerseMap] PixiJS loaded')
      const gsap = (await import('gsap')).default
      gsapRef = gsap
      console.log('[MetVerseMap] GSAP loaded')

      if (destroyed) return

      const zones = zonesProp ?? DEFAULT_ZONES
      const ZONE_BOUNDS = zonesToBounds(zones)
      const ZONE_EMOJIS: Record<string, string> = Object.fromEntries(
        zones.map(z => [z.key, z.emoji ?? ''])
      )

      const VIEW_W = viewW ?? window.innerWidth
      const VIEW_H = height ?? window.innerHeight
      const SCALE = VIEW_W / WORLD_W

      app = new PIXI.Application()
      await app.init({
        width: VIEW_W,
        height: VIEW_H,
        backgroundColor: BG_COLOR,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      })
      appReady = true

      console.log('[MetVerseMap] PixiJS app initialized, VIEW_W:', VIEW_W, 'VIEW_H:', VIEW_H)
      if (destroyed) { try { app.destroy(true, { children: true }) } catch {} return }
      containerRef.current?.appendChild(app.canvas)
      console.log('[MetVerseMap] Canvas appended to DOM')
      // Canvas handles all touch gestures (pinch-to-zoom, pan, tap)
      app.canvas.style.touchAction = 'none'

      // Load archetype SVGs as textures (canvas-based for reliable pixel art) + font
      const svgStrings = getAllAvatarSVGs()

      // Pre-render SVGs to canvas bitmaps for reliable PixiJS texture creation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const archetypeTextures: Record<ArchetypeId, any> = {} as any
      const RENDER_SIZE = 128 // render at 2x for crisp scaling

      await Promise.all([
        ...ARCHETYPE_IDS.map(id =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = RENDER_SIZE
              canvas.height = RENDER_SIZE
              const ctx = canvas.getContext('2d')!
              // Disable image smoothing for crisp pixel art
              ctx.imageSmoothingEnabled = false
              ctx.drawImage(img, 0, 0, RENDER_SIZE, RENDER_SIZE)
              const tex = PIXI.Texture.from(canvas)
              archetypeTextures[id] = tex
              resolve()
            }
            img.onerror = () => {
              // Fallback: try loading as data URI directly
              PIXI.Assets.load(`data:image/svg+xml,${encodeURIComponent(svgStrings[id])}`)
                .then(tex => { archetypeTextures[id] = tex })
                .catch(() => {})
                .finally(() => resolve())
            }
            img.src = `data:image/svg+xml,${encodeURIComponent(svgStrings[id])}`
          })
        ),
        document.fonts.load('52px VT323'),
      ])
      if (destroyed) {
        try { app.destroy(true, { children: true }) } catch {} return
      }

      const AVATAR_SPRITE_SIZE = RENDER_SIZE

      // World container — offset down to clear the HUD bar
      const world = new PIXI.Container()
      world.scale.set(SCALE)
      world.y = WORLD_TOP_OFFSET
      app.stage.addChild(world)

      // ── Pinch-to-zoom + pan ──────────────────────────────────────────────
      let zoomLevel = 1.0
      const MIN_ZOOM = 1.0
      const MAX_ZOOM = 3.0
      const pointers = new Map<number, { x: number; y: number }>()
      let lastPinchDist = 0
      let isPanning = false
      let lastPanPos = { x: 0, y: 0 }

      function clampPan() {
        const scaledW = WORLD_W * zoomLevel * SCALE
        const scaledH = WORLD_H * zoomLevel * SCALE
        world.x = Math.min(0, Math.max(VIEW_W - scaledW, world.x))
        world.y = Math.min(WORLD_TOP_OFFSET, Math.max(VIEW_H - scaledH + WORLD_TOP_OFFSET, world.y))
      }

      function applyZoom(newZoom: number) {
        zoomLevel = newZoom
        setIsZoomed(newZoom > MIN_ZOOM + 0.01)
      }

      resetZoomRef.current = () => {
        zoomLevel = MIN_ZOOM
        world.scale.set(SCALE)
        world.x = 0
        world.y = WORLD_TOP_OFFSET
        setIsZoomed(false)
      }

      const pixiCanvas = app.canvas as HTMLCanvasElement

      // ── Double-tap detection for zone navigation ──
      let lastTapTime = 0
      let lastTapX = 0
      let lastTapY = 0
      const DOUBLE_TAP_MS = 350
      const DOUBLE_TAP_DIST = 25

      let activeDash: any = null

      function handleDoubleTap(screenX: number, screenY: number) {
        if (!currentUserIdRef.current) return

        // Convert screen coords to world coords
        const rect = pixiCanvas.getBoundingClientRect()
        const worldX = (screenX - rect.left - world.x) / world.scale.x
        const worldY = (screenY - rect.top - world.y) / world.scale.y

        // Hit-test against zone bounds
        for (const [key, zone] of Object.entries(ZONE_BOUNDS) as [string, ZoneConfig][]) {
          if (worldX >= zone.x && worldX <= zone.x + zone.w &&
              worldY >= zone.y && worldY <= zone.y + zone.h) {
            // Found the zone — move current user's avatar there
            const ctrl = avatarControls.get(currentUserIdRef.current)
            if (!ctrl) return

            ctrl.pauseWander()
            ctrl.setZone(key) // Update wander zone so avatar stays in new zone
            const targetX = zone.x + zone.w / 2 + (Math.random() - 0.5) * zone.w * 0.4
            const targetY = zone.y + zone.h / 2 + (Math.random() - 0.5) * zone.h * 0.4

            // Clean up any previous dash emoji
            if (activeDash) {
              gsap.killTweensOf(activeDash)
              gsap.killTweensOf(activeDash.scale)
              if (activeDash.parent) activeDash.parent.removeChild(activeDash)
              activeDash = null
            }

            // Dash emoji follows the avatar during movement
            const dash = new PIXI.Text({ text: '\u{1F4A8}', style: { fontSize: 48 } })
            dash.anchor.set(0.5, 0.5)
            dash.x = ctrl.container.x
            dash.y = ctrl.container.y
            dash.scale.set(0)
            activeDash = dash
            world.addChild(dash)
            gsap.to(dash.scale, { x: 1, y: 1, duration: 0.2, ease: 'back.out(2)' })

            gsap.to(ctrl.container, {
              x: targetX, y: targetY,
              duration: 0.8,
              ease: 'power2.inOut',
              onUpdate: () => {
                dash.x = ctrl.container.x + 20
                dash.y = ctrl.container.y - 10
              },
              onComplete: () => {
                gsap.to(dash, { alpha: 0, duration: 0.3, onComplete: () => { world.removeChild(dash); activeDash = null } })
                ctrl.resumeWander()
                spawnConfetti(ctrl.container, world)
              },
            })

            onZoneChangeRef.current?.(key)
            return
          }
        }
      }

      pixiCanvas.addEventListener('pointerdown', (e: PointerEvent) => {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

        // Double-tap detection (single finger only)
        if (pointers.size === 1) {
          const now = Date.now()
          const dx = e.clientX - lastTapX
          const dy = e.clientY - lastTapY
          const dist = Math.hypot(dx, dy)

          if (now - lastTapTime < DOUBLE_TAP_MS && dist < DOUBLE_TAP_DIST) {
            handleDoubleTap(e.clientX, e.clientY)
            lastTapTime = 0 // reset to prevent triple-tap
          } else {
            lastTapTime = now
            lastTapX = e.clientX
            lastTapY = e.clientY
          }
        }

        if (pointers.size === 1 && zoomLevel > MIN_ZOOM) {
          isPanning = true
          lastPanPos = { x: e.clientX, y: e.clientY }
        }
        if (pointers.size >= 2) isPanning = false
      })

      pixiCanvas.addEventListener('pointermove', (e: PointerEvent) => {
        if (!pointers.has(e.pointerId)) return
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

        if (pointers.size === 2) {
          // Pinch zoom
          const pts = [...pointers.values()]
          const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
          const cx = (pts[0].x + pts[1].x) / 2
          const cy = (pts[0].y + pts[1].y) / 2

          if (lastPinchDist > 0) {
            const scaleDelta = dist / lastPinchDist
            const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomLevel * scaleDelta))

            // Zoom toward pinch center: adjust world position so the point
            // under the pinch center stays fixed
            const prevScale = zoomLevel * SCALE
            const nextScale = newZoom * SCALE
            world.x = cx - (cx - world.x) * (nextScale / prevScale)
            world.y = cy - (cy - world.y) * (nextScale / prevScale)
            world.scale.set(nextScale)
            applyZoom(newZoom)
            clampPan()
          }
          lastPinchDist = dist
        } else if (pointers.size === 1 && isPanning && zoomLevel > MIN_ZOOM) {
          // Single-finger pan (only when zoomed in)
          const dx = e.clientX - lastPanPos.x
          const dy = e.clientY - lastPanPos.y
          world.x += dx
          world.y += dy
          clampPan()
          lastPanPos = { x: e.clientX, y: e.clientY }
        }
      })

      const removePointer = (e: PointerEvent) => {
        pointers.delete(e.pointerId)
        lastPinchDist = 0
        if (pointers.size === 0) isPanning = false
        if (pointers.size === 1) {
          // Switch remaining pointer to pan mode
          const [remaining] = pointers.values()
          isPanning = zoomLevel > MIN_ZOOM
          lastPanPos = { x: remaining.x, y: remaining.y }
        }
      }
      pixiCanvas.addEventListener('pointerup', removePointer)
      pixiCanvas.addEventListener('pointercancel', removePointer)

      // Mouse wheel zoom (desktop) — let page scroll when fully zoomed out
      pixiCanvas.addEventListener('wheel', (e: WheelEvent) => {
        if (zoomLevel <= MIN_ZOOM + 0.01) return // let page scroll
        e.preventDefault()
        const factor = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomLevel * factor))
        const rect = pixiCanvas.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const prevScale = zoomLevel * SCALE
        const nextScale = newZoom * SCALE
        world.x = cx - (cx - world.x) * (nextScale / prevScale)
        world.y = cy - (cy - world.y) * (nextScale / prevScale)
        world.scale.set(nextScale)
        applyZoom(newZoom)
        clampPan()
      }, { passive: false })

      // Background — match VenueMap
      const bg = new PIXI.Graphics()
      bg.rect(0, 0, WORLD_W, WORLD_H).fill(BG_COLOR)
      world.addChild(bg)

      // Zone fills + strokes (match VenueMap: 0.7 alpha, 3px stroke, rounded corners)
      for (const [key, zone] of Object.entries(ZONE_BOUNDS) as [string, ZoneConfig][]) {
        const g = new PIXI.Graphics()
        g.roundRect(zone.x, zone.y, zone.w, zone.h, 8).fill({ color: zoneColorToHex(zone.color), alpha: 0.85 })
        world.addChild(g)

        const border = new PIXI.Graphics()
        border.roundRect(zone.x, zone.y, zone.w, zone.h, 8).stroke({ color: zoneColorToHex(zone.color), alpha: 0.9, width: 3 })
        world.addChild(border)
      }

      // ── Nature decorations in empty spaces between zones ──

      const nature = new PIXI.Graphics()
      nature.alpha = 0.3

      // Trees — scattered in gaps between zones
      const treeDefs = [
        { x: 690, y: 80 },   // right of main stage
        { x: 600, y: 220 },  // right of lounge
        { x: 680, y: 400 },  // far right
        { x: 20,  y: 350 },  // left of shops
        { x: 220, y: 340 },  // between bar and networking
        { x: 620, y: 570 },  // right side empty
        { x: 100, y: 650 },  // bottom-left
        { x: 250, y: 700 },  // below shops
        { x: 650, y: 720 },  // bottom-right corner
      ]
      for (const t of treeDefs) {
        // Trunk
        nature.roundRect(t.x - 3, t.y + 8, 6, 14, 2).fill(0xa08860)
        // Canopy
        nature.circle(t.x, t.y, 12).fill(0x7ab87a)
      }

      // Rocks — small scattered stones
      const rockDefs = [
        { x: 30,  y: 50 },  { x: 690, y: 160 },
        { x: 230, y: 170 }, { x: 620, y: 370 },
        { x: 30,  y: 640 }, { x: 680, y: 650 },
        { x: 220, y: 600 }, { x: 500, y: 750 },
      ]
      for (const r of rockDefs) {
        nature.ellipse(r.x, r.y, 6 + Math.random() * 4, 4 + Math.random() * 2).fill(0xb0a890)
      }

      // Flowers — tiny colored dots
      const flowerColors = [0xe88090, 0xf0c060, 0xa0d0f0, 0xd0a0e0, 0xf0a870]
      const flowerDefs = [
        { x: 690, y: 50 },  { x: 25,  y: 130 },
        { x: 280, y: 180 }, { x: 640, y: 310 },
        { x: 30,  y: 450 }, { x: 640, y: 500 },
        { x: 180, y: 640 }, { x: 650, y: 750 },
        { x: 100, y: 740 }, { x: 400, y: 750 },
      ]
      for (const f of flowerDefs) {
        const c = flowerColors[Math.floor(Math.random() * flowerColors.length)]
        nature.circle(f.x, f.y, 3).fill(c)
        nature.circle(f.x + 5, f.y - 2, 2.5).fill(c)
      }

      // Paths — faint walkways connecting zones
      const paths = new PIXI.Graphics()
      paths.alpha = 0.08
      // Main stage → bar
      paths.roundRect(150, 150, 30, 60, 4).fill(0xc8b898)
      // Main stage → lounge
      paths.roundRect(400, 150, 30, 50, 4).fill(0xc8b898)
      // Bar → networking
      paths.roundRect(150, 310, 30, 60, 4).fill(0xc8b898)
      // Lounge → networking
      paths.roundRect(400, 310, 30, 50, 4).fill(0xc8b898)
      // Networking → courtyard
      paths.roundRect(420, 550, 30, 50, 4).fill(0xc8b898)

      world.addChild(paths)
      world.addChild(nature)

      // Zone labels with emoji + text
      for (const [key, zone] of Object.entries(ZONE_BOUNDS) as [string, ZoneConfig][]) {
        // Emoji icon (small) — skip if no emoji configured
        const emojiText = ZONE_EMOJIS[key]
        if (emojiText) {
          const emoji = new PIXI.Text({
            text: emojiText,
            style: { fontSize: 40 },
          })
          emoji.alpha = 0.6
          emoji.anchor.set(0.5, 1)
          emoji.x = zone.x + zone.w / 2
          emoji.y = zone.y + zone.h / 2 - 4
          world.addChild(emoji)
        }

        // Text label below emoji
        const label = new PIXI.Text({
          text: zone.label,
          style: { fontFamily: 'VT323', fontSize: 36, fill: 0x2a2240 },
        })
        label.alpha = 0.6
        label.anchor.set(0.5, 0)
        label.x = zone.x + zone.w / 2
        label.y = zone.y + zone.h / 2 + 2
        world.addChild(label)
      }

      // Track avatar containers + pause/resume for proximity detection
      const avatarControls = new Map<string, {
        container: InstanceType<typeof PIXI.Container>
        pauseWander: () => void
        resumeWander: () => void
        stop: () => void
        setZone: (zone: string) => void
      }>()

      // ── Spawn a single avatar ──
      const CONFETTI_COLORS = [0xFFD700, 0xFF69B4, 0xA78BFA, 0x14B8A6, 0xFF6B6B, 0x6BCB77, 0xFFD93D]

      function spawnConfetti(container: any, worldRef: any) {
        for (let i = 0; i < 10; i++) {
          const piece = new PIXI.Graphics()
          const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
          piece.rect(-2, -2, 4, 4).fill(color)
          piece.x = container.x
          piece.y = container.y
          piece.alpha = 1
          worldRef.addChild(piece)

          const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.5
          const dist = 40 + Math.random() * 40
          const duration = 0.6 + Math.random() * 0.4

          gsap.to(piece, {
            x: container.x + Math.cos(angle) * dist,
            y: container.y + Math.sin(angle) * dist - 20 - Math.random() * 40,
            rotation: (Math.random() - 0.5) * 12,
            alpha: 0,
            duration,
            delay: i * 0.04,
            ease: 'power2.out',
            onComplete: () => worldRef.removeChild(piece),
          })
        }
      }

      function spawnAvatar(participant: Participant, isNewArrival = false) {
        const spawn = getSpawnPosition(zones, participant.home_zone)

        const container = new PIXI.Container()
        container.x = spawn.x
        container.y = spawn.y
        container.cullable = true
        world.addChild(container)

        // Drop shadow — renders behind the avatar
        const shadow = new PIXI.Graphics()
        shadow.ellipse(0, 2, 22, 8).fill({ color: 0x000000, alpha: 0.25 })
        container.addChild(shadow)

        const archetypeId = (ARCHETYPE_IDS as readonly string[]).includes(participant.archetype)
          ? participant.archetype as ArchetypeId : DEFAULT_ARCHETYPE

        const avatarSprite = new PIXI.Sprite(archetypeTextures[archetypeId])
        avatarSprite.anchor.set(0.5, 1)
        // Scale avatar for 720px world
        avatarSprite.scale.set(90 / AVATAR_SPRITE_SIZE)
        container.addChild(avatarSprite)

        // Nameplate pill — dark translucent for all avatars
        const isCurrentUser = participant.id === currentUserIdRef.current
        const nameplateH = 16
        const nameplateW = 56
        const nameplateBg = new PIXI.Graphics()
        const nameplateY = -(AVATAR_SPRITE_SIZE * avatarSprite.scale.y) - 10
        nameplateBg.roundRect(-nameplateW / 2, nameplateY - nameplateH, nameplateW, nameplateH, 4)
          .fill({ color: 0x1a1b23, alpha: 0.75 })
        container.addChild(nameplateBg)

        const nameTag = new PIXI.Text({
          text: participant.name.split(' ')[0],
          style: {
            fontFamily: 'VT323',
            fontSize: 40,
            fill: 0xffffff,
            stroke: { color: 0x1a1b23, width: 2 },
          },
        })
        nameTag.anchor.set(0.5, 1)
        nameTag.y = nameplateY - 2
        container.addChild(nameTag)

        // Resize nameplate to fit text
        nameplateBg.clear()
        const pad = 16
        const tw = nameTag.width + pad
        const th = nameTag.height + 6
        nameplateBg.roundRect(-tw / 2, nameplateY - th, tw, th, 4)
          .fill({ color: 0x1a1b23, alpha: 0.75 })

        // Current user: crown above nameplate. Others: verified badge if they have socials.
        const hasSocials = participant.linkedin || participant.twitter || participant.instagram || participant.phone
        if (isCurrentUser) {
          const crown = new PIXI.Text({ text: '\u{1F451}', style: { fontSize: 50 } })
          crown.anchor.set(0.5, 1)
          crown.y = nameplateY - th - 4
          container.addChild(crown)
        } else if (hasSocials) {
          const badgeR = 12
          const badgeY = nameplateY - th - badgeR - 4
          const badge = new PIXI.Graphics()
          badge.circle(0, badgeY, badgeR).fill(0x3b82f6)
          container.addChild(badge)

          const check = new PIXI.Graphics()
          check.moveTo(-5, badgeY).lineTo(-1, badgeY + 4).lineTo(6, badgeY - 5)
          check.stroke({ width: 2.5, color: 0xffffff })
          container.addChild(check)
        }

        container.eventMode = 'static'
        container.cursor = 'pointer'
        container.on('pointerdown', () => onClickRef.current(participant))

        // Pauseable wandering loop
        let active = true
        let paused = false
        let interruptResolve: (() => void) | null = null
        let resumeResolve: (() => void) | null = null

        const interrupt = () => { interruptResolve?.(); interruptResolve = null }

        const interruptible = (): Promise<void> =>
          new Promise(r => { interruptResolve = r })

        const sleep = (ms: number): Promise<void> =>
          Promise.race([new Promise<void>(r => setTimeout(r, ms)), interruptible()])

        const moveTo = (tx: number, ty: number, duration: number): Promise<void> =>
          Promise.race([
            new Promise<void>(r => gsap.to(container, { x: tx, y: ty, duration, ease: 'none', onComplete: r })),
            interruptible(),
          ])

        const pauseWander = () => {
          paused = true
          gsap.killTweensOf(container)
          interrupt()
        }
        const resumeWander = () => {
          paused = false
          resumeResolve?.()
          resumeResolve = null
        }

        let currentZone = participant.home_zone

        const setZone = (zone: string) => { currentZone = zone }

        const wander = async () => {
          await sleep(Math.random() * WANDER_PAUSE_MIN)
          while (active) {
            if (paused) {
              await new Promise<void>(r => { resumeResolve = r })
              continue
            }
            let target = getSpawnPosition(zones, currentZone)
            let bestDist = 0
            for (let attempt = 0; attempt < WANDER_CANDIDATES; attempt++) {
              const candidate = getSpawnPosition(zones, currentZone)
              const minDist = Math.min(
                ...[...avatarControls.values()]
                  .filter(c => c.container !== container)
                  .map(c => Math.hypot(c.container.x - candidate.x, c.container.y - candidate.y))
              )
              if (minDist > MIN_SEP) { target = candidate; break }
              if (minDist > bestDist) { bestDist = minDist; target = candidate }
            }
            const dist = Math.hypot(target.x - container.x, target.y - container.y)
            await moveTo(target.x, target.y, dist / 60)
            if (paused) continue
            await sleep(WANDER_PAUSE_MIN + Math.random() * WANDER_PAUSE_RANGE)
          }
        }
        wander()

        const stop = () => {
          active = false
          gsap.killTweensOf(container)
          interrupt()
          resumeResolve?.()
        }

        avatarControls.set(participant.id, { container, pauseWander, resumeWander, stop, setZone })
        stopWandering.push(stop)

        // Entry animation for new arrivals
        if (isNewArrival) {
          container.scale.set(0)
          gsap.to(container.scale, { x: 1, y: 1, duration: 0.4, ease: 'back.out(1.7)' })
          spawnConfetti(container, world)
        }
      }

      // ── Initial spawn ──
      console.log('[MetVerseMap] Spawning', participantsRef.current.length, 'avatars')
      const initialIds = new Set<string>()
      for (const participant of participantsRef.current) {
        spawnAvatar(participant)
        initialIds.add(participant.id)
      }
      console.log('[MetVerseMap] All avatars spawned')

      // ── Sync participants (add/remove) every 2s without rebuilding the canvas ──
      let crownAdded = false
      syncInterval = setInterval(() => {
        const current = participantsRef.current
        const currentIds = new Set(current.map(p => p.id))

        // Remove departed participants with exit animation
        for (const [id, ctrl] of avatarControls) {
          if (!currentIds.has(id)) {
            ctrl.stop()
            avatarControls.delete(id)
            // Dramatic exit: shrink + fly up + fade out
            gsap.to(ctrl.container, {
              y: ctrl.container.y - 120,
              alpha: 0,
              duration: 0.4,
              ease: 'power2.in',
            })
            gsap.to(ctrl.container.scale, {
              x: 0, y: 0,
              duration: 0.4,
              ease: 'power2.in',
              onComplete: () => { try { world.removeChild(ctrl.container) } catch {} },
            })
          }
        }

        // Add new participants (with entry animation)
        for (const p of current) {
          if (!avatarControls.has(p.id)) {
            const isActuallyNew = !initialIds.has(p.id)
            spawnAvatar(p, isActuallyNew)
            initialIds.add(p.id)
          }
        }

        // Retroactively add crown if currentUserId loaded after initial spawn
        if (!crownAdded && currentUserIdRef.current) {
          const ctrl = avatarControls.get(currentUserIdRef.current)
          if (ctrl) {
            // Check if crown already exists
            const hasCrown = ctrl.container.children.some((c: any) => c.text === '\u{1F451}')
            if (!hasCrown) {
              const sprite = ctrl.container.children[0] as any
              const nameplateY = sprite ? -(AVATAR_SPRITE_SIZE * sprite.scale.y) - 10 : -60
              const nameTag = ctrl.container.children[2] as any
              const th = nameTag ? nameTag.height + 6 : 20
              const crown = new PIXI.Text({ text: '\u{1F451}', style: { fontSize: 50 } })
              crown.anchor.set(0.5, 1)
              crown.y = nameplateY - th - 4
              ctrl.container.addChild(crown)
            }
            crownAdded = true
          }
        }
      }, 2000)

      // Proximity detector — spatial grid approach: O(N) instead of O(N²)
      // Cell size = GRID_CELL so two avatars within range are always in same or adjacent cells.
      const interacting = new Set<string>()
      // Cooldown: tracks the earliest time a pair can interact again (keyed "idA:idB")
      const cooldowns = new Map<string, number>()

      proximityInterval = setInterval(() => {
        // Build spatial grid: cellKey -> list of avatar IDs in that cell
        const grid = new Map<string, string[]>()
        for (const [id, ctrl] of avatarControls) {
          const cx = Math.floor(ctrl.container.x / GRID_CELL)
          const cy = Math.floor(ctrl.container.y / GRID_CELL)
          const key = `${cx},${cy}`
          const cell = grid.get(key)
          if (cell) cell.push(id)
          else grid.set(key, [id])
        }

        // For each avatar, only check avatars in the same + 8 neighboring cells
        const checked = new Set<string>()
        const now = Date.now()

        for (const [idA, ctrlA] of avatarControls) {
          if (interacting.has(idA)) continue
          const cx = Math.floor(ctrlA.container.x / GRID_CELL)
          const cy = Math.floor(ctrlA.container.y / GRID_CELL)

          for (let nx = cx - 1; nx <= cx + 1; nx++) {
            for (let ny = cy - 1; ny <= cy + 1; ny++) {
              const neighbors = grid.get(`${nx},${ny}`)
              if (!neighbors) continue

              for (const idB of neighbors) {
                if (idB === idA) continue
                const pairKey = idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`
                if (checked.has(pairKey)) continue
                checked.add(pairKey)

                if (interacting.has(idB)) continue
                if (now < (cooldowns.get(pairKey) ?? 0)) continue

                const ctrlB = avatarControls.get(idB)!
                const dx = ctrlA.container.x - ctrlB.container.x
                const dy = ctrlA.container.y - ctrlB.container.y
                if (Math.hypot(dx, dy) > PROXIMITY) continue

                // Trigger interaction
                interacting.add(idA)
                interacting.add(idB)
                ctrlA.pauseWander()
                ctrlB.pauseWander()

                // Emoji bubble at midpoint, above both avatars
                const midX = (ctrlA.container.x + ctrlB.container.x) / 2
                const midY = Math.min(ctrlA.container.y, ctrlB.container.y) - 80
                const emojiText = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
                const bubble = new PIXI.Text({ text: emojiText, style: { fontSize: 32 } })
                bubble.anchor.set(0.5, 1)
                bubble.x = midX
                bubble.y = midY
                bubble.scale.set(0)
                world.addChild(bubble)
                gsap.to(bubble.scale, { x: 1, y: 1, duration: 0.35, ease: 'back.out(1.7)' })

                // Gentle float animation
                const floatTween = gsap.to(bubble, { y: midY - 12, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })

                // Fire callback so index.tsx can generate a story
                const partA = participantsRef.current.find(p => p.id === idA)
                const partB = participantsRef.current.find(p => p.id === idB)
                if (partA && partB) onInteractionRef.current?.(partA, partB)

                // End interaction after INTERACTION_DURATION_MIN–(MIN+RANGE)ms
                const duration = INTERACTION_DURATION_MIN + Math.random() * INTERACTION_DURATION_RANGE
                setTimeout(() => {
                  if (destroyed) return  // canvas already torn down — bail out
                  floatTween.kill()
                  gsap.to(bubble, {
                    alpha: 0, scale: 0, duration: 0.25,
                    onComplete: () => { world?.removeChild(bubble) },
                  })
                  interacting.delete(idA)
                  interacting.delete(idB)
                  cooldowns.set(pairKey, Date.now() + COOLDOWN_MS)
                  ctrlA.resumeWander()
                  ctrlB.resumeWander()
                }, duration)
              }
            }
          }
        }
      }, 500)
    }

    setup().catch(err => console.error('[MetVerseMap] GameCanvas setup failed:', err))

    return () => {
      destroyed = true
      resetZoomRef.current = null
      setIsZoomed(false)
      if (syncInterval) clearInterval(syncInterval)
      if (proximityInterval) clearInterval(proximityInterval)
      stopWandering.forEach(stop => stop())
      // Kill all GSAP tweens before PixiJS destroys the display objects —
      // otherwise GSAP tries to set properties on nullified objects.
      if (gsapRef) {
        gsapRef.globalTimeline.getChildren(true, true, true).forEach((t: { kill: () => void }) => t.kill())
      }
      if (app && appReady) {
        try { app.destroy(true, { children: true }) } catch (_) { /* ignore if already destroyed */ }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewW, height, zonesProp])

  return (
    <div style={{ position: 'relative', width: viewW ?? '100vw', height: height ?? '100vh' }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          background: BG_CSS,
          touchAction: 'none',
        }}
      />
      {isZoomed && (
        <button
          onClick={() => resetZoomRef.current?.()}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: 8,
            border: '2px solid #3d2b1a',
            background: '#f5f0dc',
            boxShadow: '2px 2px 0 #3d2b1a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation',
          }}
          aria-label="Reset zoom"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#3d2b1a">
            {/* Top-left: arrowhead at center, tail toward corner */}
            <polygon points="8,8 8,2 6,4 3,1 1,3 4,6 2,8" />
            {/* Top-right: arrowhead at center, tail toward corner */}
            <polygon points="12,8 18,8 16,6 19,3 17,1 14,4 12,2" />
            {/* Bottom-left: arrowhead at center, tail toward corner */}
            <polygon points="8,12 2,12 4,14 1,17 3,19 6,16 8,18" />
            {/* Bottom-right: arrowhead at center, tail toward corner */}
            <polygon points="12,12 12,18 14,16 17,19 19,17 16,14 18,12" />
          </svg>
        </button>
      )}
    </div>
  )
}
