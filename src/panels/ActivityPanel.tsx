import { useEffect, useRef } from 'react'
import type { ActivityItem, CommunityStats, MetVerseMapTheme } from '../types'

const DEFAULT_THEME = {
  primary: '#eae7f0',
  accent: '#00d4aa',
  secondary: '#f0a030',
  border: '#70b8e8',
  text: '#2d2d40',
  textMuted: '#6a6a80',
  fontFamily: "'VT323', monospace",
}

function resolveTheme(theme?: MetVerseMapTheme) {
  return { ...DEFAULT_THEME, ...theme }
}

interface Props {
  activities: ActivityItem[]
  stats?: CommunityStats
  showStats?: boolean
  theme?: MetVerseMapTheme
  layout: 'side' | 'bottom'
}

export function ActivityPanel({ activities, stats, showStats = true, theme, layout }: Props) {
  const t = resolveTheme(theme)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [activities.length])

  const isBottom = layout === 'bottom'

  return (
    <div style={{
      display: 'flex',
      flexDirection: isBottom ? 'row' : 'column',
      height: isBottom ? 'auto' : '100%',
      background: t.primary,
      borderLeft: isBottom ? 'none' : `2px solid ${t.border}`,
      borderTop: isBottom ? `2px solid ${t.border}` : 'none',
      fontFamily: t.fontFamily,
      color: t.text,
      overflow: 'hidden',
    }}>
      {/* Activity Feed */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <div style={{
          padding: '10px 14px 6px',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          color: t.accent,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            width: 8,
            height: 8,
            background: t.accent,
            display: 'inline-block',
          }} />
          ACTIVITY
        </div>

        <div
          ref={feedRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 14px 10px',
          }}
        >
          {activities.map((item, i) => (
            <div key={i} style={{
              padding: '8px 0',
              borderLeft: `2px solid ${t.accent}`,
              paddingLeft: 10,
              marginBottom: 4,
            }}>
              <div style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: t.text,
              }}>
                {item.user}
              </div>
              <div style={{
                fontSize: 14,
                color: t.textMuted,
              }}>
                {item.action}{' '}
                <span style={{ color: t.accent, fontWeight: 'bold' }}>
                  {item.target}
                </span>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div style={{
              color: t.textMuted,
              fontSize: 14,
              padding: '16px 0',
              textAlign: 'center',
            }}>
              No activity yet
            </div>
          )}
        </div>
      </div>

      {/* Community Stats */}
      {showStats && stats && (
        <div style={{
          borderTop: isBottom ? 'none' : `1px solid ${t.border}`,
          borderLeft: isBottom ? `1px solid ${t.border}` : 'none',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: isBottom ? 'row' : 'column',
          gap: isBottom ? 24 : 8,
          flexShrink: 0,
        }}>
          {stats.members != null && (
            <StatRow value={stats.members} label="MEMBERS" theme={t} />
          )}
          {stats.activeNow != null && (
            <StatRow value={stats.activeNow} label="ACTIVE NOW" theme={t} />
          )}
          {stats.districts != null && (
            <StatRow value={stats.districts} label="DISTRICTS" theme={t} />
          )}
        </div>
      )}
    </div>
  )
}

function StatRow({ value, label, theme }: { value: number; label: string; theme: ReturnType<typeof resolveTheme> }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <span style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.secondary,
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontSize: 12,
        letterSpacing: '1.5px',
        color: theme.textMuted,
      }}>
        {label}
      </span>
    </div>
  )
}
