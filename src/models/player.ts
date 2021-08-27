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

type Version = number | 'USER'
export type RankingsVersions = NullablePosition<Version> 

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
}

export enum UserRanking {
  AllIn,
  Neutral,
  AllOut,
  Unranked
}

export type Position<T> = {
  QB: T
  RB: T
  WR: T
  TE: T
}

export type NullablePosition<T> ={
  QB?: T
  RB?: T
  WR?: T
  TE?: T
}