import { GetDraftResponse, UserDraft } from '../../models/draft'
import { Player, Positions } from '../../models/player'

export type QueuePlayerPayload = {
  playerId: string
}

export type DequeuePlayerPayload = {
  playerId: string
}

export type UpdateQueueOrderPayload = { 
  newIndex: number 
  oldIndex: number 
}

export type GetDraftsThunkFulfilledPayload = UserDraft[]

export type LoadDraftThunkFulfilledPayload = {
  draftDetails: GetDraftResponse
}

export type GetRanksThunkFulfilledPayload = Positions<Player[]>

export type DraftPlayerThunkPayload = {
  playerId: string
}

export type DeleteDraftPickFulfilledPayload = {
  playerId: string
}