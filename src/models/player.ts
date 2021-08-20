export type Player = {
  key: string
  name: string
  team: string
  bye: number
  rank: number
  points: number
  risk: number
  adp: string
  tier: number
  notes: string
  position: PlayerPosition
  earlySos: number
  playoffSos: number
  fullSos: number
  userRank?: UserRanking
  // Frontend specific properties
  drafted?: boolean
  queued?: boolean
}

export type RankingsVersions = {
  QB: number
  RB: number
  WR: number
  TE: number
  FLEX: number
}

export type Tier = {
  tierNumber: number
  players: string[]
}

export type PopulatedTier = {
  playerPosition: PlayerPosition
  tierNumber: number
  players: Player[]
}

export enum PlayerPosition {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  FLEX = 'FLEX'
}

export type AllTiers = {
  qbTiers: PopulatedTier[]
  rbTiers: PopulatedTier[]
  wrTiers: PopulatedTier[]
  teTiers: PopulatedTier[]
  // flexTiers: PopulatedTier[]
}

export enum UserRanking {
  AllIn,
  Neutral,
  AllOut,
  Unranked
}