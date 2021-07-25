import { FC } from 'react'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { Tier } from './Tier'

type PositionRanksProps = {
  position: PlayerPosition
  ranks: PopulatedTier[]
  draftPlayer: (draftId: string) => void
}

export const PositionRanks: FC<PositionRanksProps> = ({
  position,
  ranks,
  draftPlayer
}) => {
  console.log('hi')
  const createTiers = () => 
    ranks.map(tier => 
      <Tier 
        key={tier.tierNumber} 
        draftPlayer={draftPlayer} 
        tier={tier}
        playerPosition={position}
      />
    )

  return (
    <div className="Group">
      {createTiers()}
    </div>
  )
}