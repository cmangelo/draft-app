import { FC } from 'react'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { Tier } from './Tier'

type PositionRanksProps = {
  position: PlayerPosition
  ranks: PopulatedTier[]
  draftPlayer: (draftId: string) => void
  hideDraftedPlayers: boolean
}

export const PositionRanks: FC<PositionRanksProps> = ({
  position,
  ranks,
  draftPlayer,
  hideDraftedPlayers
}) => {
  const createTiers = () => 
    ranks.map(tier => 
      <Tier 
        key={tier.tierNumber} 
        draftPlayer={draftPlayer} 
        tier={tier}
        playerPosition={position}
        hideDraftedPlayers={hideDraftedPlayers}
      />
    )

  return (
    <div className="Group">
      {createTiers()}
    </div>
  )
}