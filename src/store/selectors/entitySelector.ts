import { createSelector } from '@reduxjs/toolkit'
import { KeyedMap, NumberedMap } from '../../models/common'
import { AllTiers, Player, PlayerPosition, PopulatedTier, Tier } from '../../models/player'
import { RootState } from '../store'

const entityStateSelector = (state: RootState) => state.entity
export const playerSelector = createSelector(entityStateSelector, state => state.players)

const qbTierSelector = createSelector(entityStateSelector, state => state.tiers[PlayerPosition.QB])
const rbTierSelector = createSelector(entityStateSelector, state => state.tiers[PlayerPosition.RB])
const wrTierSelector = createSelector(entityStateSelector, state => state.tiers[PlayerPosition.WR])
const teTierSelector = createSelector(entityStateSelector, state => state.tiers[PlayerPosition.TE])
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
  (players, tiers, draftedPlayers, queuedPlayers): PopulatedTier[] => populateTiers(PlayerPosition.QB, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedRbTierSelector = createSelector(
  playerSelector,
  rbTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers): PopulatedTier[] => populateTiers(PlayerPosition.RB, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedWrTierSelector = createSelector(
  playerSelector,
  wrTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers): PopulatedTier[] => populateTiers(PlayerPosition.WR, draftedPlayers, queuedPlayers, players, tiers)
)
export const populatedTeTierSelector = createSelector(
  playerSelector,
  teTierSelector,
  draftedPlayersSelector,
  queuedPlayersSelector,
  (players, tiers, draftedPlayers, queuedPlayers): PopulatedTier[] => populateTiers(PlayerPosition.TE, draftedPlayers, queuedPlayers, players, tiers)
)

export const populatedTierSelector = createSelector(
  populatedQbTierSelector,
  populatedRbTierSelector,
  populatedWrTierSelector,
  populatedTeTierSelector,
  (qbTiers, rbTiers, wrTiers, teTiers): AllTiers => ({
    [PlayerPosition.QB]: qbTiers,
    [PlayerPosition.RB]: rbTiers,
    [PlayerPosition.WR]: wrTiers,
    [PlayerPosition.TE]: teTiers,
  })
)

