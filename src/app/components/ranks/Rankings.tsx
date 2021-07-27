import { FC } from 'react'
import { AllTiers } from '../../../models/player'
import { PositionRanks } from './PositionRanks'

type RankingsProps = {
  rankings: AllTiers
  draftPlayer: (playerId: string) => void
}

export const Rankings: FC<RankingsProps> = ({
  rankings,
  draftPlayer
}) => { 

  const renderGroups = () => {
    if (!rankings) return

    return Object.values(rankings).map((positionRanks) => {
      if (!positionRanks || !positionRanks.length) return null
      return (
        <PositionRanks
          key={positionRanks[0].playerPosition}
          ranks={positionRanks}
          position={positionRanks[0].playerPosition} 
          draftPlayer={draftPlayer} 
          hideDraftedPlayers 
         />
      )
    })
  }

  return (
    <div className="Rankings">
      <div className="ranks">
        <div className="groups">
          {renderGroups()}
        </div>
      </div>
    </div>
  )
}