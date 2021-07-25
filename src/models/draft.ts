import { Player, RankingsVersions } from './player'

export type UserDraft = {
  draftId: string
  draftDateTime: string
  draftName: string
}

export type PlayerCount = {
  quarterback: number
  runningback: number
  wideReceiver: number
  tightEnd: number
  flex: number
  defense: number
  kicker: number
  bench: number
}

export type DraftConfig = {
  numDrafters: number
  playerCount: PlayerCount
  draftName: string
  owner: string
}

export type DraftPicks = {
  [pickNum: number]: string
}

export type DraftDetails = {
  picks: DraftPicks
  config: DraftConfig
}

export type CreateDraftRequest = {
  draftConfig: DraftConfig
  ownerDraftPosition: number
}

export type CreateDraftResponse = {
  draftId: string
  rankingsVersions: RankingsVersions
}

export type DraftPlayerRequest = {
  playerId: string
  pickNumber: number
}

export type JoinDraftRequest = {
  draftPosition: number
}

export type DraftOrder = {
  [draftPos: number]: string
}

export type GetDraftResponse = {
  picks: DraftPicks
  rankingsVersions: RankingsVersions
  config: DraftConfig
  draftOrder: DraftOrder
}

export type DraftPick = {
  overall: number
  roundPick: number
  round: number
  player: Player
}

export type TeamsWithPicks = {
  [teamId: string]: DraftPick[]
}