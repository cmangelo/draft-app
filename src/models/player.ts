export enum PlayerPosition {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
}

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

export type Version = number | 'USER'
export type RankingsVersions = NullablePositions<Version> 

export type Tier = {
  tierNumber: number
  players: string[]
}

export type PopulatedTier = {
  playerPosition: PlayerPosition
  tierNumber: number
  players: Player[]
}


export type AllTiers = Positions<PopulatedTier[]>

export enum UserRanking {
  AllIn,
  Neutral,
  AllOut,
  Unranked
}

export type Positions<T> = {
  [key in PlayerPosition]: T
}

export type NullablePositions<T> = {
  [key in PlayerPosition]: T | null
}