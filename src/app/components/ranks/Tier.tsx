import { FC } from 'react'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { PlayerRow } from './PlayerRow'

type TierProps = {
  tier: PopulatedTier
  playerPosition: PlayerPosition
  draftPlayer: (draftId: string) => void
}

export const Tier: FC<TierProps> = ({
  tier,
  draftPlayer,
  playerPosition
}) => {

  const listPlayers = () => {
    return tier.players.map((player) => {
      return (
        <PlayerRow
          key={player.key}
          player={player}
          draftPlayer={draftPlayer}
          playerPosition={playerPosition}
        />
      )
    })
  }

  return (
    <div>
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