import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Draggable } from 'react-beautiful-dnd'
import { PopulatedTier } from '../../../models/player'
import { PlayerRow } from '../ranks/PlayerRow'

type TierBucketProps = {
  tier: PopulatedTier
  insertTier: (insertAfter: number) => void
  deleteTier: (tierNumber: number) => void
}

export const TierBucket: FC<TierBucketProps> = ({
  tier,
  insertTier,
  deleteTier
}) => {
  const isEmpty = tier.players.length === 0

  const handleHeaderButtonClick = () => {
    if (isEmpty) {
      deleteTier(tier.tierNumber)
    } else {
      insertTier(tier.tierNumber)
    }
  }

  return (
    <div className="tier-bucket">
      <header>
        <h3>Tier {tier.tierNumber}</h3>
        <FontAwesomeIcon 
          icon={isEmpty ? 'times' : 'plus'}
          title={isEmpty ? 'Remove this tier' : 'Add another tier' }
          onClick={handleHeaderButtonClick}
          />
      </header>
      <div className={`player-list ${isEmpty && 'empty-list'}`}>
        {
          isEmpty ? (
            <p>No players in this tier</p>

          ) : (
            tier.players.map((player, index) => (
              <Draggable
                key={player.key}
                draggableId={player.key}
                index={index}>
                {
                  provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>

                        <PlayerRow key={player.key} player={player}/>
                    </div>
                  )
                }
              </Draggable>
            ))
          )
        }
      </div>
    </div>
  )
}