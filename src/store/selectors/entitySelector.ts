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
const draftedPlayersSelector = createSelector(entityStateSelector, state => state.draftedPlayers)
const queuedPlayersSelector = createSelector(entityStateSelector, state => state.queuedPlayers)

const populateTiers = (
  playerPosition: PlayerPosition,
  draftedPlayers: KeyedMap<boolean>,
  queuedPlayers: KeyedMap<boolean>,
  players?: KeyedMap<Player>, 
  tiers?: NumberedMap<Tier>, 
) => !players || !tiers 
  ? [] 
  : Object.keys(tiers).map(tier => {
    const tierNumber = parseInt(tier)

    return {
      players: tiers[tierNumber].players.map(player => ({
        ...players[player], 
        drafted: draftedPlayers[player],
        queued: queuedPlayers[player],
      })),
      playerPosition,
      tierNumber
    } as PopulatedTier
  })

export const populatedQbTierSelector = createSelector(
  playerSelector,
  qbTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers) => populateTiers(PlayerPosition.QB, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedRbTierSelector = createSelector(
  playerSelector,
  rbTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers) => populateTiers(PlayerPosition.RB, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedWrTierSelector = createSelector(
  playerSelector,
  wrTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers) => populateTiers(PlayerPosition.WR, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedTeTierSelector = createSelector(
  playerSelector,
  teTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers) => populateTiers(PlayerPosition.TE, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedFlexTierSelector = createSelector(
  playerSelector,
  flexTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers) => populateTiers(PlayerPosition.FLEX, draftedPlayers, queuedPlayers, players, tiers)
)

export const populatedTierSelector = createSelector(
  populatedQbTierSelector,
  populatedRbTierSelector,
  populatedWrTierSelector,
  populatedTeTierSelector,
  // populatedFlexTierSelector,
  (qbTiers, rbTiers, wrTiers, teTiers) => ({
    qbTiers,
    rbTiers,
    wrTiers,
    teTiers,
    // flexTiers
  })
)

