import { createSelector } from '@reduxjs/toolkit'
import { DraftPick, PlayerCount, TeamsWithPicks } from '../../models/draft'
import { getCurrRoundPick, getCurrTeam, getNewRound } from '../slices/draftArenaSlice'
import { RootState } from '../store'
import { playerSelector } from './entitySelector'

const draftArenaSelector = (state: RootState) => state.draftArena
export const draftsSelector = createSelector(draftArenaSelector, (draftState) => draftState.drafts)
export const draftConfigSelector = createSelector(draftArenaSelector, (draftState) => draftState.draftConfig)
export const pickStateSelector = createSelector(draftArenaSelector, (draftState) => draftState.pickState)
export const teamsSelector = createSelector(draftArenaSelector, (draftState) => draftState.teams)
export const picksSelector = createSelector(draftArenaSelector, (draftState) => draftState.picks)
export const queueSelector = createSelector(draftArenaSelector, (draftState) => draftState.queue)
export const teamsWithPicksSelector = createSelector(
  picksSelector,
  draftConfigSelector,
  playerSelector,
  (picks, draftConfig, players): TeamsWithPicks => {
    if (!draftConfig || !players || !picks) return {}

    const numDrafters = draftConfig?.numDrafters ?? 1
    const numRounds = getNumRounds(draftConfig?.playerCount as PlayerCount)
    const totalNumPicks = numDrafters * numRounds

    return new Array(totalNumPicks).fill(null).reduce((acc, _, ind) => {
      const overall = ind + 1
      const currTeam = getCurrTeam(overall, numDrafters)
      const currPicks = acc[currTeam] || new Array(numRounds).fill(null)
      const pick: DraftPick = {
        overall,
        roundPick: getCurrRoundPick(overall, numDrafters),
        round: getNewRound(overall, numDrafters),
        player: players[picks[overall]] ? {
          ...players[picks[overall]],
          drafted: true
        } : undefined,
      }
      const round = getNewRound(overall, numDrafters) - 1
      currPicks[round] = pick

      return {
        ...acc,
        [currTeam]: currPicks
      }
    }, {} as TeamsWithPicks)
  }
)

const getNumRounds = (playerCount: PlayerCount) => 
  Object.keys(playerCount).reduce((acc, key) => 
    acc + playerCount[key as keyof PlayerCount]
  , 0)


export const populatedQueueSelector = createSelector(
  playerSelector,
  queueSelector,
  (players, queuedPlayers) => {
    if (!players || !queuedPlayers) {
      return []
    }

    return queuedPlayers.map((player: string) => ({
      ...players[player],
      queued: true
    }))
  }
)