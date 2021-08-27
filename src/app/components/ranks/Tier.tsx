import { FC } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { PlayerPosition, PopulatedTier } from '../../../models/player'
import { PlayerRow } from './PlayerRow'

type TierProps = {
  tier: PopulatedTier
  playerPosition: PlayerPosition
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
  hideDraftedPlayers?: boolean
  provided?: any
}

export const Tier: FC<TierProps> = ({
  tier,
  draftPlayer,
  playerPosition,
  hideDraftedPlayers,
  queuePlayer,
  dequeuePlayer,
  // provided
}) => {

  const listPlayers = () => {
    return tier.players.map((player, index) => {
      return (

        <Draggable
                      key={player.key}
                      draggableId={player.key}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
        <PlayerRow
          key={player.key}
          player={player}
          draftPlayer={draftPlayer}
          hideDraftedPlayers={hideDraftedPlayers}
          queuePlayer={queuePlayer}
          dequeuePlayer={dequeuePlayer}
        />
        </div>
                      )}
                    </Draggable>

      )
    })
  }

  const allPlayersDrafted = () => tier.players.every((player) => player.drafted)

  return (
    <Droppable key={tier.tierNumber} droppableId={tier.playerPosition+tier.tierNumber}>
    {(provided, snapshot) => (
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


        <div ref={provided.innerRef} {...provided.droppableProps}></div>
        {listPlayers()}

        {provided.placeholder}
        </div>
      // </div>
      )}
    </Droppable>
  )
}