/**
 * MetVerse Avatar System — 12 Bali Archetype Sprites
 *
 * Single source of truth for avatar data.
 * React:  <AvatarSprite archetype="visionary" size={64} />
 * PixiJS: getAvatarSVGString("visionary") → Blob URL → PIXI.Assets.load()
 * DB:     avatarConfig jsonb → { archetype: "visionary" }
 */

export const ARCHETYPE_IDS = [
  'visionary', 'coach', 'strategist', 'rebel', 'healer',
  'influencer', 'teacher', 'builder', 'child', 'wonderwoman',
  'priestess', 'explorer',
] as const

export type ArchetypeId = typeof ARCHETYPE_IDS[number]

export const DEFAULT_ARCHETYPE: ArchetypeId = 'visionary'

export interface AvatarConfig {
  archetype: ArchetypeId
}

export function isValidArchetype(id: string): id is ArchetypeId {
  return (ARCHETYPE_IDS as readonly string[]).includes(id)
}

export function randomArchetype(): ArchetypeId {
  return ARCHETYPE_IDS[Math.floor(Math.random() * ARCHETYPE_IDS.length)]
}

// SVG rect data for each archetype (64×64 pixel-art characters)
const SVG_RECTS: Record<ArchetypeId, string> = {
  visionary: '<rect x="18" y="40" width="28" height="22" fill="#334155"/><rect x="16" y="42" width="4" height="10" fill="#334155"/><rect x="44" y="42" width="4" height="10" fill="#334155"/><rect x="18" y="38" width="4" height="3" fill="#475569"/><rect x="42" y="38" width="4" height="3" fill="#475569"/><rect x="28" y="42" width="2" height="5" fill="#94A3B8"/><rect x="34" y="42" width="2" height="5" fill="#94A3B8"/><rect x="20" y="56" width="10" height="6" fill="#1E293B"/><rect x="34" y="56" width="10" height="6" fill="#1E293B"/><rect x="14" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="46" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="18" y="14" width="28" height="24" fill="#F2DCC0"/><rect x="16" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="44" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.3"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.3"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="16" y="8" width="32" height="6" fill="#44403C"/><rect x="14" y="10" width="4" height="6" fill="#44403C"/><rect x="46" y="10" width="4" height="6" fill="#44403C"/><rect x="18" y="14" width="28" height="3" fill="#44403C"/><rect x="20" y="6" width="6" height="3" fill="#44403C"/><rect x="30" y="4" width="6" height="4" fill="#44403C"/><rect x="38" y="6" width="6" height="3" fill="#44403C"/><rect x="21" y="6" width="3" height="1" fill="#57534E"/><rect x="31" y="4" width="3" height="1" fill="#57534E"/><rect x="48" y="46" width="8" height="2" fill="#94A3B8"/><rect x="48" y="44" width="8" height="2" fill="#CBD5E1"/><rect x="49" y="44" width="2" height="1" fill="#60A5FA"/><rect x="8" y="46" width="5" height="7" fill="#FFF"/><rect x="7" y="44" width="7" height="2" fill="#FFF"/><rect x="9" y="48" width="3" height="2" fill="#D4A87A"/>',
  coach: '<rect x="20" y="40" width="24" height="22" fill="#FEF3C7"/><rect x="22" y="40" width="20" height="2" fill="#FFFBEB"/><rect x="20" y="56" width="10" height="6" fill="#FBBF24"/><rect x="34" y="56" width="10" height="6" fill="#FBBF24"/><rect x="14" y="42" width="6" height="12" fill="#C4956A"/><rect x="44" y="42" width="6" height="12" fill="#C4956A"/><rect x="18" y="14" width="28" height="24" fill="#C4956A"/><rect x="16" y="16" width="4" height="18" fill="#C4956A"/><rect x="44" y="16" width="4" height="18" fill="#C4956A"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.25"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.25"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="12" y="4" width="40" height="4" fill="#FDE68A"/><rect x="10" y="8" width="44" height="6" fill="#FDE68A"/><rect x="18" y="14" width="28" height="4" fill="#FDE68A"/><rect x="16" y="2" width="6" height="4" fill="#FDE68A"/><rect x="26" y="0" width="8" height="4" fill="#FDE68A"/><rect x="38" y="2" width="6" height="4" fill="#FDE68A"/><rect x="10" y="14" width="4" height="6" fill="#FDE68A"/><rect x="50" y="14" width="4" height="6" fill="#FDE68A"/><rect x="28" y="1" width="4" height="2" fill="#FEF3C7"/><rect x="20" y="8" width="10" height="3" fill="#475569"/><rect x="34" y="8" width="10" height="3" fill="#475569"/><rect x="30" y="9" width="4" height="2" fill="#64748B"/><rect x="18" y="40" width="3" height="12" fill="#FB923C"/><rect x="43" y="40" width="3" height="12" fill="#FB923C"/>',
  strategist: '<rect x="18" y="40" width="28" height="22" fill="#1E293B"/><rect x="16" y="42" width="4" height="10" fill="#1E293B"/><rect x="44" y="42" width="4" height="10" fill="#1E293B"/><rect x="20" y="40" width="6" height="10" fill="#334155"/><rect x="38" y="40" width="6" height="10" fill="#334155"/><rect x="26" y="40" width="12" height="14" fill="#F1F5F9"/><rect x="30" y="40" width="4" height="2" fill="#DC2626"/><rect x="30" y="42" width="4" height="8" fill="#B91C1C"/><rect x="31" y="50" width="2" height="2" fill="#B91C1C"/><rect x="31" y="42" width="1" height="6" fill="#EF4444" opacity="0.3"/><rect x="20" y="56" width="10" height="6" fill="#0F172A"/><rect x="34" y="56" width="10" height="6" fill="#0F172A"/><rect x="14" y="50" width="4" height="4" fill="#E8D4B8"/><rect x="46" y="50" width="4" height="4" fill="#E8D4B8"/><rect x="18" y="14" width="28" height="24" fill="#E8D4B8"/><rect x="16" y="16" width="4" height="18" fill="#E8D4B8"/><rect x="44" y="16" width="4" height="18" fill="#E8D4B8"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.25"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.25"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="14" y="12" width="4" height="4" fill="#6B5040" opacity="0.35"/><rect x="46" y="12" width="4" height="4" fill="#6B5040" opacity="0.35"/><rect x="16" y="6" width="34" height="6" fill="#6B5040"/><rect x="18" y="4" width="28" height="4" fill="#6B5040"/><rect x="18" y="12" width="28" height="3" fill="#6B5040"/><rect x="44" y="8" width="6" height="6" fill="#6B5040"/><rect x="20" y="5" width="8" height="2" fill="#8B6B55"/><rect x="12" y="50" width="4" height="3" fill="#FBBF24"/><rect x="13" y="50" width="2" height="1" fill="#FDE68A"/><rect x="48" y="46" width="8" height="8" fill="#F8FAFC"/><rect x="49" y="52" width="2" height="2" fill="#4ADE80"/><rect x="51" y="50" width="2" height="4" fill="#4ADE80"/><rect x="53" y="48" width="2" height="6" fill="#4ADE80"/>',
  rebel: '<rect x="18" y="40" width="28" height="22" fill="#FCA5A5"/><rect x="16" y="42" width="4" height="10" fill="#FFF"/><rect x="44" y="42" width="4" height="10" fill="#FFF"/><rect x="22" y="40" width="3" height="6" fill="#F87171"/><rect x="39" y="40" width="3" height="6" fill="#F87171"/><rect x="22" y="40" width="20" height="2" fill="#FFF"/><rect x="20" y="56" width="10" height="6" fill="#F87171"/><rect x="34" y="56" width="10" height="6" fill="#F87171"/><rect x="14" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="46" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="18" y="14" width="28" height="24" fill="#FFF2E8"/><rect x="16" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="44" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.5"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.5"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="16" y="10" width="32" height="4" fill="#F9A8D4"/><rect x="14" y="12" width="6" height="6" fill="#F9A8D4"/><rect x="44" y="12" width="6" height="6" fill="#F9A8D4"/><rect x="18" y="14" width="28" height="5" fill="#F9A8D4"/><rect x="20" y="18" width="6" height="2" fill="#F9A8D4"/><rect x="38" y="18" width="6" height="2" fill="#F9A8D4"/><rect x="6" y="4" width="10" height="2" fill="#F9A8D4"/><rect x="4" y="6" width="14" height="4" fill="#F9A8D4"/><rect x="6" y="10" width="10" height="2" fill="#F9A8D4"/><rect x="8" y="5" width="4" height="2" fill="#FBCFE8"/><rect x="48" y="4" width="10" height="2" fill="#F9A8D4"/><rect x="46" y="6" width="14" height="4" fill="#F9A8D4"/><rect x="48" y="10" width="10" height="2" fill="#F9A8D4"/><rect x="50" y="5" width="4" height="2" fill="#FBCFE8"/><rect x="24" y="48" width="2" height="2" fill="#60A5FA"/><rect x="36" y="50" width="2" height="2" fill="#FBBF24"/><rect x="30" y="52" width="2" height="2" fill="#4ADE80"/><rect x="48" y="44" width="2" height="10" fill="#D4A87A"/><rect x="47" y="42" width="4" height="3" fill="#F472B6"/>',
  healer: '<rect x="18" y="40" width="28" height="22" fill="#A7F3D0"/><rect x="16" y="42" width="4" height="10" fill="#A7F3D0"/><rect x="44" y="42" width="4" height="10" fill="#A7F3D0"/><rect x="22" y="40" width="20" height="2" fill="#D1FAE5"/><rect x="24" y="42" width="16" height="10" fill="#86EFAC"/><rect x="18" y="54" width="28" height="4" fill="#6EE7B7"/><rect x="16" y="56" width="4" height="4" fill="#6EE7B7"/><rect x="44" y="56" width="4" height="4" fill="#6EE7B7"/><rect x="20" y="58" width="10" height="4" fill="#6EE7B7"/><rect x="34" y="58" width="10" height="4" fill="#6EE7B7"/><rect x="11" y="47" width="2" height="2" fill="#C4B5FD"/><rect x="9" y="51" width="2" height="2" fill="#FDE68A"/><rect x="13" y="54" width="2" height="2" fill="#FFF"/><rect x="10" y="43" width="2" height="2" fill="#DDD6FE"/><rect x="50" y="47" width="2" height="2" fill="#C4B5FD"/><rect x="52" y="50" width="2" height="2" fill="#FDE68A"/><rect x="48" y="53" width="2" height="2" fill="#FFF"/><rect x="52" y="43" width="2" height="2" fill="#DDD6FE"/><rect x="22" y="60" width="2" height="2" fill="#C4B5FD" opacity="0.8"/><rect x="40" y="60" width="2" height="2" fill="#DDD6FE" opacity="0.8"/><rect x="30" y="62" width="2" height="2" fill="#FDE68A" opacity="0.8"/><rect x="36" y="62" width="2" height="2" fill="#C4B5FD" opacity="0.7"/><rect x="14" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="46" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="18" y="14" width="28" height="24" fill="#F2DCC0"/><rect x="16" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="44" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="29" width="5" height="3" fill="#FBCFE8" opacity="0.35"/><rect x="42" y="29" width="5" height="3" fill="#FBCFE8" opacity="0.35"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="14" y="4" width="36" height="4" fill="#8B5A3C"/><rect x="12" y="8" width="40" height="6" fill="#8B5A3C"/><rect x="16" y="5" width="8" height="2" fill="#A87050"/><rect x="18" y="14" width="28" height="5" fill="#8B5A3C"/><rect x="20" y="19" width="6" height="2" fill="#8B5A3C"/><rect x="14" y="14" width="4" height="14" fill="#8B5A3C"/><rect x="12" y="18" width="4" height="8" fill="#8B5A3C"/><rect x="46" y="14" width="6" height="10" fill="#8B5A3C"/><rect x="48" y="24" width="4" height="4" fill="#8B5A3C"/><rect x="8" y="22" width="6" height="8" fill="#8B5A3C"/><rect x="6" y="28" width="6" height="6" fill="#8B5A3C"/><rect x="8" y="34" width="6" height="4" fill="#704830"/><rect x="10" y="38" width="4" height="6" fill="#704830"/><rect x="12" y="44" width="4" height="4" fill="#704830"/><rect x="14" y="46" width="2" height="4" fill="#704830"/><rect x="9" y="30" width="3" height="2" fill="#A87050" opacity="0.3"/><rect x="10" y="36" width="3" height="2" fill="#A87050" opacity="0.3"/><rect x="12" y="42" width="2" height="2" fill="#A87050" opacity="0.3"/><rect x="16" y="4" width="3" height="3" fill="#F9A8D4"/><rect x="17" y="5" width="1" height="1" fill="#FDE68A"/><rect x="28" y="2" width="3" height="3" fill="#DDD6FE"/><rect x="29" y="3" width="1" height="1" fill="#FDE68A"/><rect x="40" y="6" width="3" height="3" fill="#FDE68A"/><rect x="41" y="7" width="1" height="1" fill="#FFF"/><rect x="8" y="24" width="2" height="2" fill="#FFF"/><rect x="9" y="25" width="1" height="1" fill="#FDE68A"/><rect x="7" y="32" width="2" height="2" fill="#F9A8D4"/><rect x="8" y="33" width="1" height="1" fill="#FDE68A"/><rect x="48" y="16" width="2" height="2" fill="#DDD6FE"/><rect x="49" y="17" width="1" height="1" fill="#FDE68A"/>',
  influencer: '<rect x="18" y="40" width="28" height="8" fill="#FBCFE8"/><rect x="18" y="48" width="28" height="14" fill="#DDD6FE"/><rect x="16" y="42" width="4" height="6" fill="#FBCFE8"/><rect x="44" y="42" width="4" height="6" fill="#FBCFE8"/><rect x="16" y="48" width="4" height="6" fill="#DDD6FE"/><rect x="44" y="48" width="4" height="6" fill="#DDD6FE"/><rect x="22" y="40" width="20" height="2" fill="#FDF2F8"/><rect x="20" y="56" width="10" height="6" fill="#C4B5FD"/><rect x="34" y="56" width="10" height="6" fill="#C4B5FD"/><rect x="14" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="46" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="18" y="14" width="28" height="24" fill="#FFF2E8"/><rect x="16" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="44" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="22" y="26" width="5" height="1" fill="#4A3728"/><rect x="29" y="32" width="6" height="2" fill="#E8927C"/><rect x="30" y="34" width="4" height="1" fill="#E8927C"/><rect x="14" y="6" width="36" height="8" fill="#FDE68A"/><rect x="20" y="7" width="6" height="2" fill="#FEF3C7"/><rect x="18" y="14" width="10" height="5" fill="#FDE68A"/><rect x="36" y="14" width="10" height="5" fill="#FDE68A"/><rect x="14" y="14" width="4" height="8" fill="#FDE68A"/><rect x="46" y="14" width="4" height="8" fill="#FDE68A"/><rect x="10" y="20" width="4" height="16" fill="#FDE68A"/><rect x="50" y="20" width="4" height="16" fill="#FDE68A"/><rect x="10" y="36" width="4" height="4" fill="#FBBF24"/><rect x="50" y="36" width="4" height="4" fill="#FBBF24"/><rect x="12" y="40" width="2" height="2" fill="#FBBF24"/><rect x="50" y="40" width="2" height="2" fill="#FBBF24"/><rect x="29" y="42" width="2" height="1" fill="#F472B6"/><rect x="33" y="42" width="2" height="1" fill="#F472B6"/><rect x="28" y="43" width="8" height="1" fill="#F472B6"/><rect x="29" y="44" width="6" height="1" fill="#F472B6"/><rect x="30" y="45" width="4" height="1" fill="#F472B6"/><rect x="31" y="46" width="2" height="1" fill="#F472B6"/><rect x="48" y="42" width="2" height="2" fill="#FDE68A"/><rect x="52" y="44" width="2" height="2" fill="#F9A8D4"/><rect x="50" y="48" width="2" height="2" fill="#C4B5FD"/>',
  teacher: '<rect x="16" y="40" width="32" height="22" fill="#DDD6FE"/><rect x="14" y="42" width="4" height="12" fill="#DDD6FE"/><rect x="46" y="42" width="4" height="12" fill="#DDD6FE"/><rect x="12" y="44" width="6" height="8" fill="#DDD6FE"/><rect x="46" y="44" width="6" height="8" fill="#DDD6FE"/><rect x="22" y="40" width="20" height="2" fill="#EDE9FE"/><rect x="20" y="56" width="10" height="6" fill="#C4B5FD"/><rect x="34" y="56" width="10" height="6" fill="#C4B5FD"/><rect x="12" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="48" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="18" y="14" width="28" height="24" fill="#FFF2E8"/><rect x="16" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="44" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="16" y="10" width="32" height="4" fill="#D4828F"/><rect x="14" y="12" width="6" height="6" fill="#D4828F"/><rect x="44" y="12" width="6" height="6" fill="#D4828F"/><rect x="18" y="14" width="28" height="4" fill="#D4828F"/><rect x="22" y="0" width="16" height="2" fill="#D4828F"/><rect x="20" y="2" width="20" height="4" fill="#D4828F"/><rect x="18" y="4" width="24" height="4" fill="#D4828F"/><rect x="20" y="8" width="20" height="2" fill="#D4828F"/><rect x="24" y="1" width="6" height="2" fill="#E0A0AA"/><rect x="22" y="4" width="4" height="2" fill="#E0A0AA" opacity="0.4"/><rect x="14" y="18" width="2" height="6" fill="#D4828F"/><rect x="48" y="18" width="2" height="6" fill="#D4828F"/><rect x="20" y="23" width="8" height="6" fill="none" stroke="#A78BFA" stroke-width="1.5"/><rect x="36" y="23" width="8" height="6" fill="none" stroke="#A78BFA" stroke-width="1.5"/><rect x="28" y="25" width="8" height="1" fill="#A78BFA"/><rect x="4" y="42" width="8" height="12" fill="#FFFBEB"/><rect x="4" y="42" width="8" height="2" fill="#FBBF24"/><rect x="6" y="46" width="4" height="1" fill="#CBD5E1"/><rect x="6" y="48" width="4" height="1" fill="#CBD5E1"/><rect x="6" y="50" width="3" height="1" fill="#CBD5E1"/><rect x="2" y="42" width="2" height="10" fill="#F472B6"/>',
  builder: '<rect x="18" y="40" width="28" height="22" fill="#F9A8D4"/><rect x="16" y="42" width="4" height="10" fill="#F9A8D4"/><rect x="44" y="42" width="4" height="10" fill="#F9A8D4"/><rect x="22" y="40" width="20" height="2" fill="#FBCFE8"/><rect x="24" y="44" width="2" height="1" fill="#FFF" opacity="0.6"/><rect x="28" y="44" width="8" height="1" fill="#FFF" opacity="0.6"/><rect x="26" y="46" width="10" height="1" fill="#FFF" opacity="0.35"/><rect x="20" y="56" width="10" height="6" fill="#F472B6"/><rect x="34" y="56" width="10" height="6" fill="#F472B6"/><rect x="14" y="50" width="4" height="4" fill="#F0D4B0"/><rect x="46" y="50" width="4" height="4" fill="#F0D4B0"/><rect x="18" y="14" width="28" height="24" fill="#F0D4B0"/><rect x="16" y="16" width="4" height="18" fill="#F0D4B0"/><rect x="44" y="16" width="4" height="18" fill="#F0D4B0"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.3"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.3"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="16" y="6" width="32" height="8" fill="#5EEAD4"/><rect x="14" y="10" width="4" height="6" fill="#5EEAD4"/><rect x="46" y="10" width="4" height="6" fill="#5EEAD4"/><rect x="18" y="6" width="8" height="2" fill="#99F6E4"/><rect x="18" y="14" width="12" height="5" fill="#5EEAD4"/><rect x="34" y="14" width="12" height="5" fill="#5EEAD4"/><rect x="20" y="19" width="4" height="2" fill="#5EEAD4"/><rect x="40" y="19" width="4" height="2" fill="#5EEAD4"/><rect x="26" y="2" width="12" height="4" fill="#5EEAD4"/><rect x="28" y="0" width="8" height="2" fill="#5EEAD4"/><rect x="28" y="4" width="8" height="3" fill="#F9A8D4"/><rect x="38" y="4" width="6" height="4" fill="#5EEAD4"/><rect x="44" y="6" width="6" height="4" fill="#5EEAD4"/><rect x="48" y="10" width="6" height="6" fill="#5EEAD4"/><rect x="50" y="16" width="6" height="8" fill="#5EEAD4"/><rect x="52" y="24" width="4" height="6" fill="#5EEAD4"/><rect x="54" y="30" width="4" height="6" fill="#2DD4BF"/><rect x="54" y="34" width="2" height="4" fill="#2DD4BF"/><rect x="49" y="12" width="2" height="4" fill="#99F6E4" opacity="0.4"/><rect x="12" y="20" width="4" height="8" fill="#64748B"/><rect x="48" y="20" width="4" height="8" fill="#64748B"/><rect x="14" y="18" width="2" height="2" fill="#94A3B8"/><rect x="48" y="18" width="2" height="2" fill="#94A3B8"/><rect x="16" y="6" width="32" height="2" fill="#64748B"/>',
  child: '<rect x="18" y="40" width="28" height="22" fill="#FDBA74"/><rect x="16" y="42" width="4" height="10" fill="#FDBA74"/><rect x="44" y="42" width="4" height="10" fill="#FDBA74"/><rect x="26" y="40" width="12" height="10" fill="#FFF"/><rect x="22" y="40" width="20" height="2" fill="#FED7AA"/><rect x="20" y="56" width="10" height="6" fill="#FB923C"/><rect x="34" y="56" width="10" height="6" fill="#FB923C"/><rect x="14" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="46" y="50" width="4" height="4" fill="#FFF2E8"/><rect x="18" y="14" width="28" height="24" fill="#FFF2E8"/><rect x="16" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="44" y="16" width="4" height="18" fill="#FFF2E8"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.35"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.35"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="14" y="8" width="36" height="6" fill="#C4B5FD"/><rect x="12" y="12" width="6" height="6" fill="#C4B5FD"/><rect x="46" y="12" width="6" height="6" fill="#C4B5FD"/><rect x="18" y="14" width="28" height="5" fill="#C4B5FD"/><rect x="20" y="14" width="6" height="2" fill="#DDD6FE" opacity="0.5"/><rect x="6" y="14" width="6" height="4" fill="#C4B5FD"/><rect x="4" y="18" width="6" height="8" fill="#C4B5FD"/><rect x="4" y="26" width="4" height="6" fill="#C4B5FD"/><rect x="6" y="32" width="2" height="4" fill="#A78BFA"/><rect x="52" y="14" width="6" height="4" fill="#C4B5FD"/><rect x="54" y="18" width="6" height="8" fill="#C4B5FD"/><rect x="56" y="26" width="4" height="6" fill="#C4B5FD"/><rect x="56" y="32" width="2" height="4" fill="#A78BFA"/><rect x="8" y="15" width="3" height="3" fill="#F472B6"/><rect x="53" y="15" width="3" height="3" fill="#F472B6"/><rect x="49" y="42" width="4" height="1" fill="#FDE68A"/><rect x="50" y="41" width="2" height="3" fill="#FDE68A"/><rect x="53" y="47" width="4" height="1" fill="#FDE68A" opacity="0.6"/><rect x="54" y="46" width="2" height="3" fill="#FDE68A" opacity="0.6"/>',
  wonderwoman: '<rect x="18" y="40" width="28" height="22" fill="#F5F0DC"/><rect x="16" y="42" width="4" height="10" fill="#F5F0DC"/><rect x="44" y="42" width="4" height="10" fill="#F5F0DC"/><rect x="22" y="40" width="20" height="2" fill="#FAF5E4"/><rect x="24" y="42" width="16" height="10" fill="#E8DCC6"/><rect x="22" y="44" width="4" height="8" fill="#C2785C"/><rect x="38" y="44" width="4" height="8" fill="#C2785C"/><rect x="28" y="38" width="8" height="2" fill="#C2785C"/><rect x="26" y="40" width="12" height="2" fill="#C2785C"/><rect x="20" y="56" width="10" height="6" fill="#C2785C"/><rect x="34" y="56" width="10" height="6" fill="#C2785C"/><rect x="12" y="48" width="6" height="6" fill="#F0D4B0"/><rect x="10" y="46" width="4" height="4" fill="#F0D4B0"/><rect x="46" y="48" width="6" height="6" fill="#F0D4B0"/><rect x="50" y="46" width="4" height="4" fill="#F0D4B0"/><rect x="18" y="14" width="28" height="24" fill="#F0D4B0"/><rect x="16" y="16" width="4" height="18" fill="#F0D4B0"/><rect x="44" y="16" width="4" height="18" fill="#F0D4B0"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="14" y="4" width="36" height="8" fill="#2C1E14"/><rect x="12" y="8" width="4" height="8" fill="#2C1E14"/><rect x="48" y="8" width="4" height="8" fill="#2C1E14"/><rect x="18" y="12" width="28" height="5" fill="#2C1E14"/><rect x="16" y="14" width="4" height="6" fill="#2C1E14"/><rect x="44" y="14" width="4" height="6" fill="#2C1E14"/><rect x="10" y="14" width="6" height="14" fill="#2C1E14"/><rect x="8" y="20" width="4" height="12" fill="#2C1E14"/><rect x="48" y="14" width="6" height="14" fill="#2C1E14"/><rect x="52" y="20" width="4" height="12" fill="#2C1E14"/><rect x="10" y="32" width="4" height="6" fill="#1A1008"/><rect x="50" y="32" width="4" height="6" fill="#1A1008"/><rect x="12" y="38" width="2" height="4" fill="#1A1008"/><rect x="50" y="38" width="2" height="4" fill="#1A1008"/><rect x="11" y="22" width="3" height="2" fill="#3D2B1A" opacity="0.3"/><rect x="50" y="22" width="3" height="2" fill="#3D2B1A" opacity="0.3"/><rect x="20" y="4" width="8" height="2" fill="#3D2B1A"/><rect x="34" y="5" width="6" height="2" fill="#3D2B1A"/><rect x="30" y="38" width="4" height="2" fill="#FFD700"/><rect x="28" y="37" width="2" height="2" fill="#FFD700"/><rect x="34" y="37" width="2" height="2" fill="#FFD700"/><rect x="31" y="36" width="2" height="1" fill="#FDE68A"/>',
  priestess: '<rect x="14" y="6" width="36" height="8" fill="#1C1917"/><rect x="18" y="14" width="28" height="4" fill="#1C1917"/><rect x="22" y="4" width="20" height="4" fill="#1C1917"/><rect x="12" y="10" width="4" height="30" fill="#1C1917"/><rect x="48" y="10" width="4" height="30" fill="#1C1917"/><rect x="10" y="16" width="4" height="24" fill="#292524"/><rect x="50" y="16" width="4" height="24" fill="#292524"/><rect x="16" y="8" width="32" height="2" fill="#FFD700"/><rect x="14" y="8" width="4" height="2" fill="#FFD700"/><rect x="46" y="8" width="4" height="2" fill="#FFD700"/><rect x="28" y="4" width="8" height="4" fill="#FFD700"/><rect x="30" y="2" width="4" height="2" fill="#FFD700"/><rect x="30" y="4" width="4" height="2" fill="#FDE68A"/><rect x="20" y="8" width="2" height="2" fill="#8B5CF6"/><rect x="42" y="8" width="2" height="2" fill="#8B5CF6"/><rect x="18" y="14" width="28" height="24" fill="#F2DCC0"/><rect x="16" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="44" y="16" width="4" height="18" fill="#F2DCC0"/><rect x="22" y="24" width="5" height="6" fill="#1E1B4B"/><rect x="37" y="24" width="5" height="6" fill="#1E1B4B"/><rect x="24" y="24" width="2" height="2" fill="#C4B5FD"/><rect x="39" y="24" width="2" height="2" fill="#C4B5FD"/><rect x="17" y="30" width="5" height="3" fill="#E8927C" opacity="0.3"/><rect x="42" y="30" width="5" height="3" fill="#E8927C" opacity="0.3"/><rect x="28" y="32" width="8" height="2" fill="#E8927C"/><rect x="29" y="34" width="6" height="1" fill="#E8927C"/><rect x="18" y="40" width="28" height="22" fill="#F5F0DC"/><rect x="16" y="42" width="4" height="10" fill="#F5F0DC"/><rect x="44" y="42" width="4" height="10" fill="#F5F0DC"/><rect x="22" y="38" width="20" height="2" fill="#FFD700"/><rect x="24" y="40" width="16" height="2" fill="#FFD700"/><rect x="28" y="42" width="8" height="2" fill="#FFD700"/><rect x="22" y="44" width="4" height="12" fill="#6D28D9"/><rect x="30" y="42" width="4" height="14" fill="#4C1D95"/><rect x="18" y="50" width="28" height="2" fill="#FFD700"/><rect x="16" y="56" width="14" height="6" fill="#E8E4D8"/><rect x="34" y="56" width="14" height="6" fill="#E8E4D8"/><rect x="14" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="46" y="50" width="4" height="4" fill="#F2DCC0"/><rect x="14" y="52" width="2" height="1" fill="#FFD700"/><rect x="48" y="52" width="2" height="1" fill="#FFD700"/>',
  explorer: '<rect x="16" y="6" width="32" height="8" fill="#5C3A1E"/><rect x="14" y="10" width="4" height="6" fill="#5C3A1E"/><rect x="46" y="10" width="4" height="6" fill="#5C3A1E"/><rect x="18" y="14" width="28" height="4" fill="#5C3A1E"/><rect x="20" y="4" width="8" height="4" fill="#5C3A1E"/><rect x="32" y="4" width="8" height="4" fill="#5C3A1E"/><rect x="22" y="2" width="6" height="3" fill="#6B4226"/><rect x="36" y="3" width="6" height="2" fill="#6B4226"/><rect x="18" y="14" width="28" height="24" fill="#C4956A"/><rect x="16" y="16" width="4" height="18" fill="#C4956A"/><rect x="44" y="16" width="4" height="18" fill="#C4956A"/><rect x="22" y="24" width="5" height="6" fill="#4A3728"/><rect x="37" y="24" width="5" height="6" fill="#4A3728"/><rect x="24" y="24" width="2" height="2" fill="#FFF"/><rect x="39" y="24" width="2" height="2" fill="#FFF"/><rect x="17" y="30" width="5" height="3" fill="#E8927C" opacity="0.3"/><rect x="42" y="30" width="5" height="3" fill="#E8927C" opacity="0.3"/><rect x="28" y="32" width="8" height="2" fill="#C07060"/><rect x="29" y="34" width="6" height="1" fill="#C07060"/><rect x="18" y="40" width="28" height="22" fill="#F5E6D3"/><rect x="16" y="42" width="4" height="10" fill="#F5E6D3"/><rect x="44" y="42" width="4" height="10" fill="#F5E6D3"/><rect x="28" y="38" width="8" height="2" fill="#14B8A6"/><rect x="28" y="40" width="8" height="6" fill="#C4956A"/><rect x="24" y="38" width="4" height="4" fill="#14B8A6"/><rect x="36" y="38" width="4" height="4" fill="#14B8A6"/><rect x="22" y="42" width="4" height="6" fill="#14B8A6"/><rect x="20" y="56" width="10" height="6" fill="#92400E"/><rect x="34" y="56" width="10" height="6" fill="#92400E"/><rect x="14" y="50" width="4" height="4" fill="#C4956A"/><rect x="46" y="50" width="4" height="4" fill="#C4956A"/><rect x="14" y="48" width="4" height="2" fill="#14B8A6"/><rect x="15" y="48" width="2" height="2" fill="#FBBF24"/>',
}

export type WonderwomanOutfitVariant = 'terracotta' | 'sage' | 'cream_wrap'

function replaceEvery(source: string, search: string, replacement: string): string {
  return source.split(search).join(replacement)
}

function withHealerSmile(rects: string): string {
  let next = rects
  next = replaceEvery(next, '<rect x="29" y="32" width="6" height="2" fill="#E8927C"/>', '<rect x="28" y="32" width="8" height="1" fill="#D9776A"/><rect x="29" y="33" width="6" height="2" fill="#D9776A"/><rect x="30" y="35" width="4" height="1" fill="#D9776A"/>')
  return next
}

function withPaleSkin(rects: string): string {
  let next = rects
  next = replaceEvery(next, '#F2DCC0', '#FFF2E8')
  return next
}

function withWonderwomanRedesign(rects: string): string {
  let next = rects

  // Lighten skin.
  next = replaceEvery(next, '#F0D4B0', '#FFF2E8')
  // Terracotta → blue (part of overalls).
  next = replaceEvery(next, '#C2785C', '#93C5FD')
  // Body + arms + details → baby blue (the overalls).
  next = replaceEvery(next, '#F5F0DC', '#93C5FD')
  next = replaceEvery(next, '#FAF5E4', '#93C5FD')
  next = replaceEvery(next, '#E8DCC6', '#93C5FD')

  // Remove gold belt accessories.
  next = replaceEvery(next, '<rect x="30" y="38" width="4" height="2" fill="#FFD700"/>', '')
  next = replaceEvery(next, '<rect x="28" y="37" width="2" height="2" fill="#FFD700"/>', '')
  next = replaceEvery(next, '<rect x="34" y="37" width="2" height="2" fill="#FFD700"/>', '')
  next = replaceEvery(next, '<rect x="31" y="36" width="2" height="1" fill="#FDE68A"/>', '')

  // Fix hands — remove oversized base hands, replace with normal-sized ones like other archetypes.
  next = replaceEvery(next, '<rect x="10" y="46" width="4" height="4" fill="#FFF2E8"/>', '')
  next = replaceEvery(next, '<rect x="50" y="46" width="4" height="4" fill="#FFF2E8"/>', '')
  next = replaceEvery(next, '<rect x="12" y="48" width="6" height="6" fill="#FFF2E8"/>', '<rect x="14" y="50" width="4" height="4" fill="#FFF2E8"/>')
  next = replaceEvery(next, '<rect x="46" y="48" width="6" height="6" fill="#FFF2E8"/>', '<rect x="46" y="50" width="4" height="4" fill="#FFF2E8"/>')

  // Remove neck (other characters don't have one).
  next = replaceEvery(next, '<rect x="28" y="38" width="8" height="2" fill="#93C5FD"/>', '')

  // Rosier blush.
  next = replaceEvery(next, '<rect x="17" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/>', '<rect x="17" y="30" width="5" height="3" fill="#F9A8D4" opacity="0.5"/>')
  next = replaceEvery(next, '<rect x="42" y="30" width="5" height="3" fill="#FBCFE8" opacity="0.4"/>', '<rect x="42" y="30" width="5" height="3" fill="#F9A8D4" opacity="0.5"/>')

  // Rebel pattern in blue: white sleeves, white collar, darker side accents, shield.
  const overlay = [
    // White sleeves
    '<rect x="16" y="42" width="4" height="10" fill="#FFF"/>',
    '<rect x="44" y="42" width="4" height="10" fill="#FFF"/>',
    // White collar
    '<rect x="22" y="40" width="20" height="2" fill="#FFF"/>',
    // Darker blue side accents
    '<rect x="22" y="40" width="3" height="6" fill="#60A5FA"/>',
    '<rect x="39" y="40" width="3" height="6" fill="#60A5FA"/>',
    // Darker blue shoes
    '<rect x="20" y="56" width="10" height="6" fill="#60A5FA"/>',
    '<rect x="34" y="56" width="10" height="6" fill="#60A5FA"/>',
    // Bandana with gold tiara emblem
    '<rect x="12" y="6" width="40" height="7" fill="#B91C1C"/>',
    '<rect x="10" y="8" width="4" height="8" fill="#B91C1C"/>',
    '<rect x="50" y="8" width="4" height="8" fill="#B91C1C"/>',
    '<rect x="18" y="13" width="28" height="2" fill="#B91C1C"/>',
    '<rect x="27" y="4" width="10" height="2" fill="#B91C1C"/>',
    '<rect x="26" y="8" width="2" height="1" fill="#FCA5A5" opacity="0.55"/>',
    '<rect x="36" y="8" width="2" height="1" fill="#FCA5A5" opacity="0.55"/>',
    // Gold shield emblem on bandana center
    '<rect x="26" y="5" width="12" height="7" fill="#FDE68A"/>',
    '<rect x="27" y="12" width="10" height="2" fill="#FDE68A"/>',
    '<rect x="28" y="14" width="8" height="1" fill="#FDE68A"/>',
    '<rect x="29" y="15" width="6" height="1" fill="#FDE68A"/>',
    '<rect x="30" y="16" width="4" height="1" fill="#FDE68A"/>',
    '<rect x="27" y="6" width="10" height="5" fill="#B91C1C"/>',
    '<rect x="28" y="11" width="8" height="2" fill="#B91C1C"/>',
    '<rect x="29" y="13" width="6" height="1" fill="#B91C1C"/>',
    '<rect x="31" y="8" width="2" height="2" fill="#FDE68A"/>',
  ].join('')

  return `${next}${overlay}`
}

export function getArchetypeRects(id: ArchetypeId): string {
  let next = SVG_RECTS[id]

  if (id === 'visionary') {
    next = withPaleSkin(next)
  }

  if (id === 'healer') {
    next = withHealerSmile(next)
  }

  if (id === 'wonderwoman') {
    next = withWonderwomanRedesign(next)
  }

  return next
}

export function getWonderwomanVariantSVGString(variant: WonderwomanOutfitVariant): string {
  const base = getArchetypeRects('wonderwoman')

  if (variant === 'terracotta') {
    return `<svg width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${base}</svg>`
  }

  if (variant === 'sage') {
    let sageRects = base
    sageRects = replaceEvery(sageRects, '#C2785C', '#6B7C5E')
    sageRects = replaceEvery(sageRects, '#F5F0DC', '#EEF0E8')
    sageRects = replaceEvery(sageRects, '#FAF5E4', '#F6F8F0')
    sageRects = replaceEvery(sageRects, '#E8DCC6', '#E0E5D9')

    return `<svg width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${sageRects}</svg>`
  }

  let creamRects = base
  creamRects = replaceEvery(creamRects, '#F5F0DC', '#FAF7EF')
  creamRects = replaceEvery(creamRects, '#FAF5E4', '#FFFDF7')
  creamRects = replaceEvery(creamRects, '#E8DCC6', '#F5F0DC')
  creamRects = replaceEvery(creamRects, '<rect x="20" y="56" width="10" height="6" fill="#C2785C"/>', '<rect x="20" y="56" width="10" height="6" fill="#E8DED0"/>')
  creamRects = replaceEvery(creamRects, '<rect x="34" y="56" width="10" height="6" fill="#C2785C"/>', '<rect x="34" y="56" width="10" height="6" fill="#E8DED0"/>')

  return `<svg width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${creamRects}</svg>`
}

/** React component — renders an archetype as inline SVG */
export function AvatarSprite({
  archetype = DEFAULT_ARCHETYPE,
  size = 64,
}: {
  archetype?: ArchetypeId | string
  size?: number
}) {
  const id = isValidArchetype(archetype) ? archetype : DEFAULT_ARCHETYPE
  const rects = getArchetypeRects(id)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: rects }}
    />
  )
}

/** Raw SVG string for a single archetype (for PixiJS Blob→texture) */
export function getAvatarSVGString(archetype: ArchetypeId | string): string {
  const id = isValidArchetype(archetype) ? archetype : DEFAULT_ARCHETYPE
  return `<svg width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${getArchetypeRects(id)}</svg>`
}

/** All SVG strings keyed by archetype ID */
export function getAllAvatarSVGs(): Record<ArchetypeId, string> {
  const result = {} as Record<ArchetypeId, string>
  for (const id of ARCHETYPE_IDS) {
    result[id] = getAvatarSVGString(id)
  }
  return result
}
