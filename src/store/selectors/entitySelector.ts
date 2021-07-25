import { createSelector } from '@reduxjs/toolkit'
import { KeyedMap, NumberedMap } from '../../models/common'
import { Player, PlayerPosition, PopulatedTier, Tier } from '../../models/player'
import { RootState } from '../store'

const entityStateSelector = (state: RootState) => state.entity
export const playerSelector = createSelector(entityStateSelector, state => state.players)

const qbTierSelector = createSelector(entityStateSelector, state => state.qbTiers)
const rbTierSelector = createSelector(entityStateSelector, state => state.rbTiers)
const wrTierSelector = createSelector(entityStateSelector, state => state.wrTiers)
const teTierSelector = createSelector(entityStateSelector, state => state.teTiers)
const flexTierSelector = createSelector(entityStateSelector, state => state.flexRanks)

const populateTiers = (
  players: KeyedMap<Player>, 
  tiers: NumberedMap<Tier>, 
  playerPosition: PlayerPosition
) => Object.keys(tiers).map(tier => {
  const tierNumber = parseInt(tier)

  return {
    players: tiers[tierNumber].players.map(player => players[player]),
    playerPosition,
    tierNumber
  } as PopulatedTier
})

export const populatedQbTierSelector = createSelector(
  playerSelector,
  qbTierSelector,
  (players, tiers) => populateTiers(players, tiers, PlayerPosition.QB)
)
export const populatedRbTierSelector = createSelector(
  playerSelector,
  rbTierSelector,
  (players, tiers) => populateTiers(players, tiers, PlayerPosition.RB)
)
export const populatedWrTierSelector = createSelector(
  playerSelector,
  wrTierSelector,
  (players, tiers) => populateTiers(players, tiers, PlayerPosition.WR)
)
export const populatedTeTierSelector = createSelector(
  playerSelector,
  teTierSelector,
  (players, tiers) => populateTiers(players, tiers, PlayerPosition.TE)
)
export const populatedFlexTierSelector = createSelector(
  playerSelector,
  flexTierSelector,
  (players, tiers) => populateTiers(players, tiers, PlayerPosition.FLEX)
)

export const populatedTierSelector = createSelector(
  populatedQbTierSelector,
  populatedRbTierSelector,
  populatedWrTierSelector,
  populatedTeTierSelector,
  populatedFlexTierSelector,
  (qbTiers, rbTiers, wrTiers, teTiers, flexTiers) => ({
    qbTiers,
    rbTiers,
    wrTiers,
    teTiers,
    // flexTiers
  })
)