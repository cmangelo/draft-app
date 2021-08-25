import { createSlice } from '@reduxjs/toolkit'
import { KeyedMap, NumberedMap } from '../../models/common'
import { Player, Tier } from '../../models/player'
import { dequeuePlayer, draftPlayerThunk, getRanksThunk, loadDraftThunk, queuePlayer } from './draftArenaSlice'

type EntityState = {
  players?: KeyedMap<Player>
  qbTiers?: NumberedMap<Tier>,
  rbTiers?: NumberedMap<Tier>,
  wrTiers?: NumberedMap<Tier>,
  teTiers?: NumberedMap<Tier>,
  draftedPlayers: KeyedMap<boolean>,
  queuedPlayers: KeyedMap<boolean>,
}

const initialState: EntityState = {
  draftedPlayers: {},
  queuedPlayers: {},
}

const buildTiers = (players: Player[]) => {
  const playerMap = players.reduce((acc, player) => {
    acc[player.key] = player
    return acc
  }, {} as KeyedMap<Player>)

  const tierMap = {} as KeyedMap<Tier>

  players.forEach(player => {
    const tier = tierMap[player.tier] || {
      tierNumber: player.tier,
      players: [],
    } as Tier
    tier.players.push(player.key)
    tierMap[player.tier] = tier
  })

  return { playerMap, tierMap }
}

export const entitySlice = createSlice({
  name: 'entitySlice',
  initialState,
  reducers: {},
  extraReducers: reducer => 
    reducer
      .addCase(getRanksThunk.fulfilled, (state, action) => {
        const {
          qbRanks,
          rbRanks,
          wrRanks,
          teRanks,
        } = action.payload

        const { playerMap: qbPlayerMap, tierMap: qbTierMap } = buildTiers(qbRanks)
        const { playerMap: rbPlayerMap, tierMap: rbTierMap } = buildTiers(rbRanks)
        const { playerMap: wrPlayerMap, tierMap: wrTierMap } = buildTiers(wrRanks)
        const { playerMap: tePlayerMap, tierMap: teTierMap } = buildTiers(teRanks)

        state.players = {
          ...qbPlayerMap,
          ...rbPlayerMap,
          ...wrPlayerMap,
          ...tePlayerMap
        }
        state.qbTiers = qbTierMap
        state.rbTiers = rbTierMap
        state.wrTiers = wrTierMap
        state.teTiers = teTierMap
      })
      .addCase(draftPlayerThunk.pending, (state, action) => {
        const playerId = action.meta.arg
        state.draftedPlayers[playerId] = true
        delete state.queuedPlayers[playerId]
      })
      .addCase(loadDraftThunk.fulfilled, (state, action) => {
        const { draftDetails } = action.payload
        const picks = draftDetails.picks
        Object.keys(picks).forEach(key => {
          const pickNumber = parseInt(key)
          state.draftedPlayers[picks[pickNumber]] = true
        })
      })
      .addCase(queuePlayer, (state, action) => {  
        const playerId = action.payload
        state.queuedPlayers[playerId] = true
      })
      .addCase(dequeuePlayer, (state, action) => {
        const playerId = action.payload
        delete state.queuedPlayers[playerId]
      })
})

export default entitySlice.reducer
