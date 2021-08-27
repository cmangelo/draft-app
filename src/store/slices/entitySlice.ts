import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveRanks } from '../../clients/proxyClient'
import { KeyedMap, NumberedMap } from '../../models/common'
import { Player, Tier } from '../../models/player'
import { RankItem } from '../../models/ranks'
import { RootState } from '../store'
import { dequeuePlayer, draftPlayerThunk, getRanksThunk, loadDraftThunk, queuePlayer } from './draftArenaSlice'

type EntityState = {
  players?: KeyedMap<Player>
  qbTiers: NumberedMap<Tier>
  rbTiers: NumberedMap<Tier>
  wrTiers: NumberedMap<Tier>
  teTiers: NumberedMap<Tier>
  draftedPlayers: KeyedMap<boolean>
  queuedPlayers: KeyedMap<boolean>
  changeSinceLastSave: boolean
}

const initialState: EntityState = {
  qbTiers: {},
  rbTiers: {},
  wrTiers: {},
  teTiers: {},
  draftedPlayers: {},
  queuedPlayers: {},
  changeSinceLastSave: false
}

const tiersToRankItems = (tiers: NumberedMap<Tier>, position: string) => {
  let rank = 1
  return Object.keys(tiers)
    .map(tierNumber => tiers[+tierNumber])
    .sort((a, b) => a.tierNumber - b.tierNumber)
    .map(tier => 
      tier.players.map(playerKey => ({
        key: playerKey,
        rank: rank++,
        tier: tier.tierNumber,
        position
      } as RankItem))
    )
    .flat()
}

export const saveRanksThunk = createAsyncThunk(
  'saveRanks',
  async (_, { getState }) => {
    const entityState = (getState() as RootState).entity
    const qbRanks = tiersToRankItems(entityState.qbTiers, 'QB')
    console.log(qbRanks)
    // await saveRanks('QB', {ranks: []})
  },
  {
    condition: (_, { getState }) => {
      console.log(getState())
      return (getState() as RootState).entity.changeSinceLastSave
    }
  }
)

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
  reducers: {
    insertTier: (state, action: PayloadAction<{position: string, insertAfter: number}>) => {
      const { position, insertAfter } = action.payload
      let tiers: NumberedMap<Tier>
      switch(position) {
        case 'QB':
          tiers = state.qbTiers || {}
          break
        case 'RB':
          tiers = state.rbTiers || {}
          break
        case 'WR':
          tiers = state.wrTiers || {}
          break
        case 'TE':
          tiers = state.teTiers || {}
          break
        default:
          tiers = {}
      }

      const newTiers = Object.keys(tiers).reduce((acc, curr) => {
        const currTierKey = parseInt(curr, 10)
        if (currTierKey <= insertAfter) {
          return {
            ...acc,
            [currTierKey]: tiers[currTierKey]
          }
        }
        return {
          ...acc,
          [currTierKey + 1]: {
            ...tiers[currTierKey],
            tierNumber: currTierKey + 1,
          },
        }
      }, {
        [insertAfter + 1]: {
          players: [],
          tierNumber: insertAfter + 1,
        } 
      } as NumberedMap<Tier>)
      state.qbTiers = newTiers
    },
    deleteTier: (state, action: PayloadAction<{position: string, tierNumber: number}>) => {
      const { position, tierNumber } = action.payload
      let tiers: NumberedMap<Tier>
      switch(position) {
        case 'QB':
          tiers = state.qbTiers || {}
          break
        case 'RB':
          tiers = state.rbTiers || {}
          break
        case 'WR':
          tiers = state.wrTiers || {}
          break
        case 'TE':
          tiers = state.teTiers || {}
          break
        default:
          tiers = {}
      }

      const newTiers = Object.keys(tiers).reduce((acc, curr) => {
        const currTierKey = parseInt(curr, 10)
        if (currTierKey < tierNumber) {
          return {
            ...acc,
            [currTierKey]: tiers[currTierKey]
          }
        }
        if (currTierKey > tierNumber) {
          return {
            ...acc,
            [currTierKey - 1]: {
              ...tiers[currTierKey],
              tierNumber: currTierKey - 1,
            },
          }
        }
        return acc
      }, {} as NumberedMap<Tier>)
      state.qbTiers = newTiers
    },
    updatePlayerRank: (state, action: PayloadAction<{
      position: string,
      startTier: number,
      endTier: number,
      startIndex: number,
      endIndex: number
    }>) => {
      const { position, startTier, endTier, startIndex, endIndex } = action.payload
      let tiers: NumberedMap<Tier>
      switch(position) {
        case 'QB':
          tiers = state.qbTiers || {}
          break
        case 'RB':
          tiers = state.rbTiers || {}
          break
        case 'WR':
          tiers = state.wrTiers || {}
          break
        case 'TE':
          tiers = state.teTiers || {}
          break
        default:
          tiers = {}
      }

      if (startTier === endTier) {
        const [removed] = tiers[startTier].players.splice(startIndex, 1)
        tiers[startTier].players.splice(endIndex, 0, removed)
      } else {
        const [removed] = tiers[startTier].players.splice(startIndex, 1)
        tiers[endTier].players.splice(endIndex, 0, removed)
        tiers[startTier].players.splice(startIndex, 0)
      }
      state.changeSinceLastSave = true
    }
  },
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

export const {
  insertTier,
  deleteTier,
  updatePlayerRank
} = entitySlice.actions

export default entitySlice.reducer
