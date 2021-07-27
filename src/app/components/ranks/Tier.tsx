import { FC } from 'react'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { PlayerRow } from './PlayerRow'

type TierProps = {
  tier: PopulatedTier
  playerPosition: PlayerPosition
  draftPlayer: (draftId: string) => void
  hideDraftedPlayers: boolean
}

export const Tier: FC<TierProps> = ({
  tier,
  draftPlayer,
  playerPosition,
  hideDraftedPlayers
}) => {

  const listPlayers = () => {
    return tier.players.map((player) => {
      return (
        <PlayerRow
          key={player.key}
          player={player}
          draftPlayer={draftPlayer}
          playerPosition={playerPosition}
          hideDraftedPlayers={hideDraftedPlayers}
        />
      )
    })
  }

  const allPlayersDrafted = () => tier.players.every((player) => player.drafted)

  return (
    <div className={hideDraftedPlayers && allPlayersDrafted() ? 'hide-tier' : ''}>
      <div className={"tier-header"} > 
      {/* (allPlayersInTierDrafted(tier))}> */}
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