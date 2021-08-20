import { FC } from 'react'
import { AllTiers, Player } from '../../../models/player'
import { PlayerQueue } from '../queue/PlayerQueue'
import { PositionRanks } from './PositionRanks'

type RankingsProps = {
  rankings: AllTiers
  playerQueue?: Player[]
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
  updateQueueOrder?: (oldIndex: number, newIndex: number) => void
}

export const Rankings: FC<RankingsProps> = ({
  rankings,
  playerQueue,
  draftPlayer,
  queuePlayer,
  dequeuePlayer,
  updateQueueOrder
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
          queuePlayer={queuePlayer}
          dequeuePlayer={dequeuePlayer}
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
          {
            playerQueue &&
              <PlayerQueue 
                queue={playerQueue}
                draftPlayer={draftPlayer}
                queuePlayer={queuePlayer}
                dequeuePlayer={dequeuePlayer}
                updateQueueOrder={updateQueueOrder}
              />
          }
        </div>
      </div>
    </div>
  )
}