import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { draftPlayer, getDraftDetails, getDrafts, getRanks } from '../../clients/proxyClient'
import { DraftConfig, DraftOrder, DraftPicks, UserDraft } from '../../models/draft'
import { Player } from '../../models/player'

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
}

const initialState: DraftState = {
  draftId: '',
  draftConfig: undefined,
  pickState: {
    overall: 1,
    currTeam: 1,
    currRound: 1,
    roundPick: 1
  },
  teams: {},
  drafts: [],
  picks: {}
}

/**
 *  Todo: move this out of this slice. this slice should be more for the current draft arena 
 */
export const getDraftsThunk = createAsyncThunk(
  'getDrafts', 
  async () => {
    const response = await getDrafts()
    return response.data 
  }
)

export const loadDraftThunk = createAsyncThunk(
  'getDraftDetails',
  async (draftId: string) => {
    const response = await getDraftDetails(draftId)
    const draftDetails = response.data
    const rankingsVersions = draftDetails.rankingsVersions
    const [
      qbRanks,
      rbRanks,
      wrRanks,
      teRanks,
      flexRanks
    ] = await Promise.allSettled([
      getRanks('QB', rankingsVersions.QB),
      getRanks('RB', rankingsVersions.RB),
      getRanks('WR', rankingsVersions.WR),
      getRanks('TE', rankingsVersions.TE),
      getRanks('FLEX', rankingsVersions.FLEX),
    ]) as PromiseFulfilledResult<AxiosResponse<Player[]>>[]

    return {
      draftDetails,
      qbRanks: qbRanks.value.data,
      rbRanks: rbRanks.value.data,
      wrRanks: wrRanks.value.data,
      teRanks: teRanks.value.data,
      flexRanks: flexRanks.value.data
    }
  }
)

export const draftPlayerThunk = createAsyncThunk(
  'draftPlayer',
  async (playerId: string, { getState }) => {
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
  },
  extraReducers: reducer => 
    reducer
      .addCase(getDraftsThunk.fulfilled, (state, action) => {
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
        const playerId = action.meta.arg
        const numDrafters = state.draftConfig?.numDrafters as number
        const newOverall = state.pickState.overall + 1
        const newRound = getNewRound(newOverall, numDrafters)

        state.picks[state.pickState.overall] = playerId

        state.pickState.overall = newOverall
        state.pickState.currTeam = getCurrTeam(newOverall, numDrafters)
        state.pickState.roundPick = getCurrRoundPick(newOverall, numDrafters)
        state.pickState.currRound = newRound


      })
      .addCase(draftPlayerThunk.fulfilled, (state, action) => {

      })
  })

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
