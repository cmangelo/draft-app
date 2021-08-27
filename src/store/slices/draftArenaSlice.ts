import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { push } from 'connected-react-router'
import { createDraft, draftPlayer, getDraftDetails, getDrafts, getRanks } from '../../clients/proxyClient'
import { CreateDraftRequest, DraftConfig, DraftOrder, DraftPicks, UserDraft } from '../../models/draft'
import { Player, PlayerPosition, RankingsVersions } from '../../models/player'
import { 
  DequeuePlayerPayload, 
  DraftPlayerThunkPayload, 
  GetDraftsThunkFulfilledPayload, 
  GetRanksThunkFulfilledPayload, 
  LoadDraftThunkFulfilledPayload, 
  QueuePlayerPayload, 
  UpdateQueueOrderPayload 
} from '../models/draftArenaActions'

export type PickState = {
  overall: number
  currTeam: number
  currRound: number
  roundPick: number
}

type DraftState = {
  draftId: string
  draftConfig?: DraftConfig
  teams: DraftOrder
  drafts: UserDraft[]
  pickState: PickState
  picks: DraftPicks
  queue: string[]
}

const initialState: DraftState = {
  draftId: '',
  pickState: {
    overall: 1,
    currTeam: 1,
    currRound: 1,
    roundPick: 1
  },
  teams: {},
  drafts: [],
  picks: {},
  queue: []
}

/**
 *  Todo: move this out of this slice. this slice should be more for the current draft arena 
 */
export const getDraftsThunk = createAsyncThunk(
  'getDrafts', 
  async (): Promise<GetDraftsThunkFulfilledPayload> => {
    const response = await getDrafts()
    return response.data 
  }
)

export const loadDraftThunk = createAsyncThunk(
  'getDraftDetails',
  async (draftId: string, { dispatch }): Promise<LoadDraftThunkFulfilledPayload> => {
    const response = await getDraftDetails(draftId)
    const draftDetails = response.data
    const rankingsVersions = draftDetails.rankingsVersions
    dispatch(getRanksThunk(rankingsVersions))

    return {
      draftDetails
    }
  }
)

export const createDraftThunk = createAsyncThunk(
  'createDraft',
  async (draftConfig: CreateDraftRequest, { dispatch }): Promise<void> => {
    const response = await createDraft(draftConfig)
    const draftId = response.data.draftId
    dispatch(push(`/drafts/${draftId}`))
  }
)

export const getRanksThunk = createAsyncThunk(
  'getRanks',
  async(rankingsVersions?: RankingsVersions): Promise<GetRanksThunkFulfilledPayload> => {
    const [
      qbRanks,
      rbRanks,
      wrRanks,
      teRanks,
    ] = await Promise.allSettled([
      getRanks(PlayerPosition.QB, rankingsVersions?.QB),
      getRanks(PlayerPosition.RB, rankingsVersions?.RB),
      getRanks(PlayerPosition.WR, rankingsVersions?.WR),
      getRanks(PlayerPosition.TE, rankingsVersions?.TE),
    ]) as PromiseFulfilledResult<AxiosResponse<Player[]>>[]

    return { 
      [PlayerPosition.QB]: qbRanks.value.data,
      [PlayerPosition.RB]: rbRanks.value.data,
      [PlayerPosition.WR]: wrRanks.value.data,
      [PlayerPosition.TE]: teRanks.value.data,
    }
  }
)

export const draftPlayerThunk = createAsyncThunk(
  'draftPlayer',
  async ({ playerId }: DraftPlayerThunkPayload, { getState }): Promise<void> => {
    const state = getState() as { draftArena: DraftState }
    const { draftId, pickState } = state.draftArena
    // Decrementing overall by 1 since the 'pending' reducer runs and increments overall before this gets run
    await draftPlayer(playerId, draftId, pickState.overall - 1)
  }
)

export const draftArenaSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    queuePlayer: (state, action: PayloadAction<QueuePlayerPayload>) => {
      const { playerId } = action.payload
      state.queue.push(playerId)
    },
    dequeuePlayer: (state, action: PayloadAction<DequeuePlayerPayload>) => {
      const { playerId } = action.payload
      removePlayerFromQueue(state, playerId)
    },
    updateQueueOrder: (state, action: PayloadAction<UpdateQueueOrderPayload>) => {
      const { oldIndex, newIndex } = action.payload
      const [removed] = state.queue.splice(oldIndex, 1)
      state.queue.splice(newIndex, 0, removed)
    },
    unloadDraft: () => initialState
  },
  extraReducers: reducer => 
    reducer
      .addCase(getDraftsThunk.fulfilled, (state, action: PayloadAction<GetDraftsThunkFulfilledPayload>) => {
        state.drafts = action.payload
      })
      .addCase(loadDraftThunk.fulfilled, (state, action) => {
        const { arg: draftId } = action.meta
        const { draftDetails } = action.payload
        const picks = draftDetails.picks

        state.draftId = draftId
        state.draftConfig = action.payload.draftDetails.config
        state.teams = draftDetails.draftOrder
        state.picks = picks

        const numDrafters = state.draftConfig.numDrafters as number
        let maxPick = 0
        Object.keys(picks).forEach(pickNumber => maxPick = Math.max(maxPick, parseInt(pickNumber)))
        const overall = maxPick + 1
        state.pickState.overall = overall
        state.pickState.currRound = getNewRound(overall, numDrafters)
        state.pickState.currTeam = getCurrTeam(overall, numDrafters)
        state.pickState.roundPick = getCurrRoundPick(overall, numDrafters)
      })
      .addCase(draftPlayerThunk.pending, (state, action) => {
        // Optimistically update the draft state assuming call succeeds
        const { playerId } = action.meta.arg
        const numDrafters = state.draftConfig?.numDrafters as number
        const newOverall = state.pickState.overall + 1
        const newRound = getNewRound(newOverall, numDrafters)

        state.picks[state.pickState.overall] = playerId

        state.pickState.overall = newOverall
        state.pickState.currTeam = getCurrTeam(newOverall, numDrafters)
        state.pickState.roundPick = getCurrRoundPick(newOverall, numDrafters)
        state.pickState.currRound = newRound

        removePlayerFromQueue(state, playerId)
      })
})

export const {
  queuePlayer,
  dequeuePlayer,
  updateQueueOrder,
  unloadDraft
} = draftArenaSlice.actions

export default draftArenaSlice.reducer

export const getCurrRoundPick = (overall: number, numDrafters: number) => {
  const mod = overall % numDrafters
  return mod === 0 ? numDrafters : mod
}

export const getCurrTeam = (overall: number, numDrafters: number) => {
  const currRound = Math.ceil(overall / numDrafters)
  const oddRound = currRound % 2 !== 0

  const mod = overall % numDrafters

  if (oddRound) {
    return mod === 0 ? numDrafters : mod
  } else {
    return mod === 0 ? 1 : (numDrafters - mod) + 1
  }
}

export const getNewRound = (newOverall: number, numTeams: number) => Math.ceil(newOverall / numTeams)

export const removePlayerFromQueue = (state: DraftState, playerId: string) => 
  state.queue = state.queue.filter(p => p !== playerId)