import { FC } from 'react'
import { Player, PlayerPosition, UserRanking } from '../../../models/player'
import { UserRankWidget } from './UserRankWidget'

type PlayerRowProps = {
  player: Player
  playerPosition: PlayerPosition
  draftPlayer?: (playerId: string) => void
  rankPlayer?: (playerId: string, rank: UserRanking) => void
}

export const PlayerRow: FC<PlayerRowProps> = ({
  player,
  playerPosition,
  draftPlayer,
  rankPlayer
}) => {

  const handleDraftButtonClick = ($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    $event.stopPropagation();
    if (draftPlayer)
        draftPlayer(player.key);
  }

  const renderActionButton = () => {
    if (!!draftPlayer)
      return (
        <button 
          onClick={($event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleDraftButtonClick($event)} 
          disabled={player.drafted}>
            Draft
        </button>
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
    <div className={`player-row ${!!draftPlayer && player.drafted ? 'drafted' : ''}`}
    // (!!props.selectPlayer ? "clickable " : "") +
    // (!!props.selectPlayer && props.selected ? "selected" : "")}
    // onClick={selectPlayer}
    >
    {/* <span className={`player-rank ${!!props.draftPlayer ? UserRanking[player.userRank] : ''}`}>{rank}</span> */}
      <div className={`player-name `}>
        <div>{player.name}</div>
        <div className="player-team-info">
            <span>{playerPosition} - {player.team}</span>
        </div>
      </div>
      <span className="player-adp">
        <div>ADP</div>
        {player.adp}
      </span>
      {renderActionButton()}
    </div>
  )
}