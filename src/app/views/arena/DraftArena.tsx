import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { Rankings } from './../../components/ranks/Rankings'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { draftPlayerThunk, loadDraftThunk } from '../../../store/slices/draftArenaSlice'
import { DraftToolbar } from '../../components/DraftToolbar'
import { pickStateSelector, teamsWithPicksSelector } from '../../../store/selectors/draftArenaSelector'
import { DraftBoard } from '../../components/draft-board/DraftBoard'

export const DraftArena: FC = () => {
  const dispatch = useAppDispatch()
  const rankings = useAppSelector(state => populatedTierSelector(state))
  const draftState = useAppSelector(state => pickStateSelector(state))
  const teamsWithPicks = useAppSelector(state => teamsWithPicksSelector(state))
  console.log(teamsWithPicks)

  const draftPlayer = (playerId: string) => dispatch(draftPlayerThunk(playerId))


  useEffect(() => {
    dispatch(loadDraftThunk('b724fd8c-e086-457a-bf91-93a71f011dbd'))
  }, [dispatch])

  return (
    <div className="DraftArena">
      <div className="board-container">
        <DraftBoard teamsWithPicks={teamsWithPicks} />
      </div>
      <div className="ranks-container">
        <DraftToolbar state={draftState} />
        <Rankings 
          draftPlayer={draftPlayer}
          rankings={rankings}
        />
      </div>
    </div>
  )
}