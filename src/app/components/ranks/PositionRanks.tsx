import { FC } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { Tier } from './Tier'

type PositionRanksProps = {
  position: PlayerPosition
  ranks: PopulatedTier[]
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
  hideDraftedPlayers?: boolean
}

export const PositionRanks: FC<PositionRanksProps> = ({
  position,
  ranks,
  draftPlayer,
  hideDraftedPlayers,
  queuePlayer,
  dequeuePlayer
}) => {
  const onDragEnd = () => {}

  const createTiers = () => 
    ranks.map(tier => (

            <Tier 
              key={tier.tierNumber} 
              draftPlayer={draftPlayer} 
              tier={tier}
              playerPosition={position}
              hideDraftedPlayers={hideDraftedPlayers}
              queuePlayer={queuePlayer}
              dequeuePlayer={dequeuePlayer}

            />
    )
    )

  return (
    <div className="Group">
      <DragDropContext onDragEnd={onDragEnd}>
        {createTiers()}
      </DragDropContext>
    </div>
  )
}