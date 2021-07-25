import { FC } from 'react'
import { DraftPick, TeamsWithPicks } from '../../../models/draft'
import { DraftPickCard } from './DraftPickCard'

type DraftBoardProps = {
  teamsWithPicks: TeamsWithPicks
}

export const DraftBoard: FC<DraftBoardProps> = ({
  teamsWithPicks
}) => {

  const renderGrid = () => {
    return Object.keys(teamsWithPicks).map(key => {
      const pickPosition = parseInt(key, 10)
      return (
        <div className="team-column" key={pickPosition}>
          {renderColumn(teamsWithPicks[pickPosition])}
        </div>
      )
    })
  }

  const renderColumn = (teamPicks: DraftPick[]) => {
    return teamPicks.map((pick: DraftPick, ind: number) => {
      const { player, roundPick, round } = pick

      return <DraftPickCard 
        key={round}
        roundPick={roundPick}
        round={round}
        player={player}
        />
    })
  }

  return (
    <div className="DraftBoard">
      {renderGrid()}
    </div>
  )
}