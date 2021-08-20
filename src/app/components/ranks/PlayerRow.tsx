import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC } from 'react'
import { Player, UserRanking } from '../../../models/player'
import { UserRankWidget } from './UserRankWidget'

type PlayerRowProps = {
  player: Player
  hideDraftedPlayers?: boolean
  draftPlayer?: (playerId: string) => void
  rankPlayer?: (playerId: string, rank: UserRanking) => void
  queuePlayer?: (playerId: string) => void
  dequeuePlayer?: (playerId: string) => void
}

export const PlayerRow: FC<PlayerRowProps> = ({
  player,
  draftPlayer,
  rankPlayer,
  hideDraftedPlayers,
  queuePlayer,
  dequeuePlayer
}) => {

  const handleDraftButtonClick = ($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    $event.stopPropagation()
    if (draftPlayer)
      draftPlayer(player.key)
  }

  const handleQueueButtonClick = ($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    $event.stopPropagation()
    if (!queuePlayer || !dequeuePlayer)
      return

    !player.queued ? queuePlayer(player.key) : dequeuePlayer(player.key)
  }

  const renderActionButton = () => {
    if (!!draftPlayer)
      return (
        <>
          <button 
            className={'queue-button' + (player.queued ? ' queued' : '')}
            onClick={($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleQueueButtonClick($event)}>
            <FontAwesomeIcon icon={player.queued ? 'user-check' : 'user-plus'}/>
          </button>
          <button 
            className="draft-button"
            onClick={($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleDraftButtonClick($event)} 
            disabled={player.drafted}>
              Draft
          </button>
        </>
      )
    if (!!rankPlayer)
      return (
        <UserRankWidget
          player={player}
          rankPlayer={() => console.log('hi')}
          size="lg" />
      )
}

  return (
    <div className={`
      player-row 
      ${!!draftPlayer && player.drafted ? 'drafted' : ''}
      ${hideDraftedPlayers ? 'hide-drafted' : ''}
      `}
    hidden={player.drafted}
    // (!!props.selectPlayer ? "clickable " : "") +
    // (!!props.selectPlayer && props.selected ? "selected" : "")}
    // onClick={selectPlayer}
    >
    {/* <span className={`player-rank ${!!props.draftPlayer ? UserRanking[player.userRank] : ''}`}>{rank}</span> */}
      <div className={`player-name `}>
        <div className="name">{player.name}</div>
        <div className="player-team-info">
            <span>{player.position} - {player.team}</span>
        </div>
      </div>
      <span className="player-adp">
        <div>Full</div>
        {player.fullSos}
      </span>
      <span className="player-adp">
        <div>Early</div>
        {player.earlySos}
      </span>
      <span className="player-adp">
        <div>Late</div>
        {player.playoffSos}
      </span>
      <span className="player-adp">
        <div>ADP</div>
        {player.adp}
      </span>
      {renderActionButton()}
    </div>
  )
}