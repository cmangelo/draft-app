import { FC } from 'react'
import { Player } from '../../../models/player'
import { PlayerRow } from '../ranks/PlayerRow'

type PlayerQueueProps = {
  queue: Player[]
  draftPlayer?: (playerId: string) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
}

export const PlayerQueue: FC<PlayerQueueProps> = ({
  queue,
  draftPlayer,
  queuePlayer,
  dequeuePlayer
}) => {
  return (
    <div className="Group PlayerQueue">
      <h3>Queue {queue.length ? `(${queue.length})` : ''}</h3>
    { !queue.length ? (
      <div className="empty-queue">
        <h4>Add players to queue</h4>
      </div>
    ) : (
      <div className="populated-queue">
        {
          queue.map(player => (
            <PlayerRow
              key={player.key}
              player={player}
              draftPlayer={draftPlayer}
              queuePlayer={queuePlayer}
              dequeuePlayer={dequeuePlayer}
            />
          ))
        }
      </div>
    )}
    </div>
  )
}