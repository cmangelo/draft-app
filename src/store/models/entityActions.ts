import { PlayerPosition } from '../../models/player'

export type InsertTierPayload = {
  position: PlayerPosition
  insertAfter: number
}

export type DeleteTierPayload = {
  position: PlayerPosition
  tierNumber: number
}

export type UpdatePlayerRankPayload = {
  position: PlayerPosition
  startTier: number
  endTier: number
  startIndex: number
  endIndex: number
}