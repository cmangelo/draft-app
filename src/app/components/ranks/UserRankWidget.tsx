import { FC } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Player, UserRanking } from '../../../models/player'

type UserRankWidgetProps = {
  size: 'lg' | '3x'
  player: Player
  rankPlayer: (playerId: string, rank: UserRanking) => void
}

export const UserRankWidget: FC<UserRankWidgetProps> = ({
  size,
  player,
  rankPlayer
}) => {

  const handleRankingClick = (rank: UserRanking, $event: any) => {
    $event.stopPropagation()

    rank = rank === player.userRank ? UserRanking.Unranked : rank
    rankPlayer(player.key, rank)
  }

  return (
    <div className="UserRankWidget">
      <FontAwesomeIcon
        // icon={player?.userRank === UserRanking.AllIn ? "check-square" : "square"}
        icon={['fas', 'check-square']}
        size={size}
        className="all-in"
        onClick={($event) => handleRankingClick(UserRanking.AllIn, $event)} />
      <FontAwesomeIcon
        icon={player?.userRank === UserRanking.Neutral ? "check-square" : "square"}
        size={size}
        className="neutral"
        onClick={($event) => handleRankingClick(UserRanking.Neutral, $event)} />
      <FontAwesomeIcon
        icon={player?.userRank === UserRanking.AllOut ? "check-square" : "square"}
        size={size}
        className="all-out"
        onClick={($event) => handleRankingClick(UserRanking.AllOut, $event)} />
    </div>
  )
}