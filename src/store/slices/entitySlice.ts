import { createSlice } from '@reduxjs/toolkit'
import { KeyedMap, NumberedMap } from '../../models/common'
import { Player, Tier } from '../../models/player'
import { draftPlayerThunk, loadDraftThunk } from './draftArenaSlice'

type EntityState = {
  players: KeyedMap<Player>
  qbTiers: NumberedMap<Tier>,
  rbTiers: NumberedMap<Tier>,
  wrTiers: NumberedMap<Tier>,
  teTiers: NumberedMap<Tier>,
  flexRanks: NumberedMap<Tier>,
}

const initialState: EntityState = {
  players: {},
  qbTiers: {},
  rbTiers: {},
  wrTiers: {},
  teTiers: {},
  flexRanks: {},
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
      .addCase(loadDraftThunk.fulfilled, (state, action) => {
        const {
          qbRanks,
          rbRanks,
          wrRanks,
          teRanks,
          flexRanks,
          draftDetails
        } = action.payload

        const { playerMap: qbPlayerMap, tierMap: qbTierMap } = buildTiers(qbRanks)
        const { playerMap: rbPlayerMap, tierMap: rbTierMap } = buildTiers(rbRanks)
        const { playerMap: wrPlayerMap, tierMap: wrTierMap } = buildTiers(wrRanks)
        const { playerMap: tePlayerMap, tierMap: teTierMap } = buildTiers(teRanks)
        const { tierMap: flexTierMap } = buildTiers(flexRanks)

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
        state.flexRanks = flexTierMap

        const { picks } = draftDetails
        const draftedPlayers = new Set<string>()
        Object.values(picks).forEach(pick => draftedPlayers.add(pick))
        draftedPlayers.forEach(draftedPlayer => {
          state.players[draftedPlayer].drafted = true
        })
      })
      .addCase(draftPlayerThunk.pending, (state, action) => {
        const playerId = action.meta.arg
        state.players[playerId].drafted = true
      })
})

export default entitySlice.reducer
