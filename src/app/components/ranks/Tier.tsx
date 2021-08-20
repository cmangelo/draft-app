import { FC } from 'react'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { PlayerRow } from './PlayerRow'

type TierProps = {
  tier: PopulatedTier
  playerPosition: PlayerPosition
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
  hideDraftedPlayers: boolean
}

export const Tier: FC<TierProps> = ({
  tier,
  draftPlayer,
  playerPosition,
  hideDraftedPlayers,
  queuePlayer,
  dequeuePlayer
}) => {

  const listPlayers = () => {
    return tier.players.map((player) => {
      return (
        <PlayerRow
          key={player.key}
          player={player}
          draftPlayer={draftPlayer}
          hideDraftedPlayers={hideDraftedPlayers}
          queuePlayer={queuePlayer}
          dequeuePlayer={dequeuePlayer}
        />
      )
    })
  }

  const allPlayersDrafted = () => tier.players.every((player) => player.drafted)

  return (
    <div className={hideDraftedPlayers && allPlayersDrafted() ? 'hide-tier' : ''}>
      <div className="tier-header"> 
        <div className="tier-number">
          {
            tier.playerPosition === PlayerPosition.FLEX ?
              <span>FLEX</span> :
              <span>{tier.playerPosition} - Tier {tier.tierNumber}</span>
          }
        </div>
        <hr />
      </div>
      {listPlayers()}
    </div>
  )
}