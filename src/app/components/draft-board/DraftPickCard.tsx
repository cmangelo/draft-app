import { FC } from 'react'
import { Player } from '../../../models/player'

type DraftPickCardProps = {
  player: Player
  round: number
  roundPick: number
}

export const DraftPickCard: FC<DraftPickCardProps> = ({
  player,
  round,
  roundPick
}) => {
  if (!player) {
    return (
      <div className="draft-pick-card">
        <div className="top">
          <span className="pos-team"></span>
          <span className="round-pick">{round}.{roundPick}</span>
        </div>
      </div>
    )
  } else {
    const firstName = player.name.split(' ')[0]
    const lastName = player.name.split(' ')[1]

    return (
      <div className={`draft-pick-card ${player.position}`}>
        <div className="top">
          <span className="pos-team">{player.position} - {player.team}</span>
          <span className="round-pick">{round}.{roundPick}</span>
        </div>
        <div className="bottom">
          <div className="name">
            <span className="first-name">{firstName}</span>
            <span className="last-name">{lastName}</span>
          </div>
          <span className="bye">({player.bye})</span>
        </div>
      </div>
    )
  }
}