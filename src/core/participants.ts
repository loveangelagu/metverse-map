export interface Participant {
  id: string
  name: string
  company: string
  role: string
  linkedin: string
  twitter: string
  instagram: string
  phone?: string
  telegram?: string
  interests: string[]
  traits: string[]
  energy: number
  home_zone: string
  archetype: string
  profilePicUrl?: string
  goals?: Array<{ goalId: number; label: string; rank: number }>
  persona?: { id: string; label: string; description: string; emoji: string } | null
}

export const DEFAULT_PARTICIPANTS: Participant[] = [
  {
    id: 'u10', name: 'Angela Gu', company: 'LoveAngela Studio', role: 'Creative Director',
    linkedin: 'loveangelagu', twitter: '', instagram: 'loveangelagu',
    interests: ['Community', 'Wellness', 'Branding'], traits: ['Warm', 'Connector'], energy: 90,
    home_zone: 'lounge', archetype: 'rebel',
  },
  {
    id: 'u11', name: 'Laurent Run', company: 'LaurentRun Media', role: 'Content Creator',
    linkedin: 'laurentrun', twitter: '', instagram: 'laurentrun',
    interests: ['Content', 'Media', 'Design'], traits: ['Expressive', 'Social'], energy: 84,
    home_zone: 'main_stage', archetype: 'influencer',
  },
  {
    id: 'u12', name: 'Sachin S', company: 'BukitHub', role: 'Community Builder',
    linkedin: 'sachin-s-b51bba253', twitter: '', instagram: 'bukithub',
    interests: ['Bali', 'Coworking', 'Startups'], traits: ['Grounded', 'Networker'], energy: 80,
    home_zone: 'networking', archetype: 'visionary',
  },
  {
    id: 'u13', name: 'Flo Germaine', company: 'Foncé Studio', role: 'Visual Artist',
    linkedin: '', twitter: '', instagram: 'foncegermaine',
    interests: ['Photography', 'Culture', 'Fashion'], traits: ['Bold', 'Aesthetic'], energy: 75,
    home_zone: 'courtyard', archetype: 'coach',
  },
  {
    id: 'u14', name: 'Shri', company: 'Shrixperience', role: 'Experience Designer',
    linkedin: '', twitter: '', instagram: 'shrixperience',
    interests: ['Events', 'Travel', 'Storytelling'], traits: ['Curious', 'Energetic'], energy: 88,
    home_zone: 'bar', archetype: 'priestess',
  },
  {
    id: 'u15', name: 'Alexei Wind', company: 'WindCraft', role: 'Athlete & Founder',
    linkedin: '', twitter: 'AlexeyWind', instagram: '',
    interests: ['Kitesurfing', 'Adventure', 'Tech'], traits: ['Free-spirited', 'Fearless'], energy: 92,
    home_zone: 'shops', archetype: 'explorer',
  },
  {
    id: 'u16', name: 'Kismet Krystle', company: 'Plyant (AI Local Food Platform)', role: 'Founder & CTO',
    linkedin: 'krystle-r-wilson', twitter: '', instagram: 'kismetkrystle',
    interests: ['Poetry', 'Sustainability', 'AI'], traits: ['Visionary', 'Philosophical'], energy: 92,
    home_zone: 'main_stage', archetype: 'teacher',
  },
]
