import { FC } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Player } from '../../../models/player'
import { PlayerRow } from '../ranks/PlayerRow'

type PlayerQueueProps = {
  queue: Player[]
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
  updateQueueOrder?: (oldIndex: number, newIndex: number) => void
}

export const PlayerQueue: FC<PlayerQueueProps> = ({
  queue,
  draftPlayer,
  queuePlayer,
  dequeuePlayer,
  updateQueueOrder
}) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !updateQueueOrder)
      return

    updateQueueOrder(
      result.source.index,
      result.destination.index
    )
  }

  return (
    <div className="Group PlayerQueue">
      <h3>Queue {queue.length ? `(${queue.length})` : ''}</h3>
    { !queue.length ? (
      <div className="empty-queue">
        <h4>Add players to queue</h4>
      </div>
    ) : (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="queue">
          {provided => (
            <div className="populated-queue"
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {
                queue.map((player, index) => (
                  <Draggable key={player.key} draggableId={player.key} index={index}>
                    {provided => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <PlayerRow
                          key={player.key}
                          player={player}
                          draftPlayer={draftPlayer}
                          queuePlayer={queuePlayer}
                          dequeuePlayer={dequeuePlayer}
                        />  
                      </div>
                      )
                    }
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )}
    </div>
  )
}