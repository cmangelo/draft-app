import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { Rankings } from './../../components/ranks/Rankings'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { draftPlayerThunk, loadDraftThunk } from '../../../store/slices/draftArenaSlice'
import { DraftToolbar } from '../../components/DraftToolbar'
import { pickStateSelector, teamsWithPicksSelector } from '../../../store/selectors/draftArenaSelector'
import { DraftBoard } from '../../components/draft-board/DraftBoard'

const RANKS_VIEWS = {
  DEFAULT: '',
  FULL_RANKS: 'full-screen-ranks',
  FULL_BOARD: 'full-screen-board'
}
const RANKS_VIEWS_ORDER = [RANKS_VIEWS.DEFAULT, RANKS_VIEWS.FULL_BOARD, RANKS_VIEWS.DEFAULT, RANKS_VIEWS.FULL_RANKS]
const RANKS_VIEW_ICON = ['up', 'down', 'down', 'up']

export const DraftArena: FC = () => {
  const dispatch = useAppDispatch()
  const rankings = useAppSelector(state => populatedTierSelector(state))
  const draftState = useAppSelector(state => pickStateSelector(state))
  const teamsWithPicks = useAppSelector(state => teamsWithPicksSelector(state))

  const [ranksView, setRanksView] = useState(0)
  // const ranksViewState = useState(RANKS_VIEWS.DEFAULT)

  const draftPlayer = (playerId: string) => dispatch(draftPlayerThunk(playerId))
  const changeRanksView = () => setRanksView(ranksView < RANKS_VIEWS_ORDER.length - 1 ? ranksView + 1 : 0)

  useEffect(() => {
    dispatch(loadDraftThunk('b724fd8c-e086-457a-bf91-93a71f011dbd'))
  }, [dispatch])

  return (
    <div className={'DraftArena ' + `${RANKS_VIEWS_ORDER[ranksView]}`}>
      <div className="board-container">
        <DraftBoard teamsWithPicks={teamsWithPicks} />
      </div>
      <div className="ranks-container">
        <DraftToolbar 
          state={draftState} 
          changeRanksView={changeRanksView}
          viewIcon={RANKS_VIEW_ICON[ranksView]}
        />
        <Rankings 
          draftPlayer={draftPlayer}
          rankings={rankings}
        />
      </div>
    </div>
  )
}