import { FC, useEffect, useState } from 'react'
import { useHistory, RouteComponentProps } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { Rankings } from './../../components/ranks/Rankings'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { 
  draftPlayerThunk, 
  loadDraftThunk, 
  queuePlayer as queuePlayerAction,
  dequeuePlayer as dequeuePlayerAction,
  updateQueueOrder as updateQueueOrderAction,
  unloadDraft
} from '../../../store/slices/draftArenaSlice'
import { DraftToolbar } from '../../components/DraftToolbar'
import { pickStateSelector, populatedQueueSelector, teamsWithPicksSelector } from '../../../store/selectors/draftArenaSelector'
import { DraftBoard } from '../../components/draft-board/DraftBoard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const RANKS_VIEWS = {
  DEFAULT: '',
  FULL_RANKS: 'full-screen-ranks',
  FULL_BOARD: 'full-screen-board'
}
const RANKS_VIEWS_ORDER = [RANKS_VIEWS.DEFAULT, RANKS_VIEWS.FULL_BOARD, RANKS_VIEWS.DEFAULT, RANKS_VIEWS.FULL_RANKS]
const RANKS_VIEW_ICON = ['up', 'down', 'down', 'up']

type MatchParams = {
  draftId: string
}

export const DraftArena: FC<RouteComponentProps<MatchParams>> = ({
  match
}) => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const rankings = useAppSelector(state => populatedTierSelector(state))
  const draftState = useAppSelector(state => pickStateSelector(state))
  const teamsWithPicks = useAppSelector(state => teamsWithPicksSelector(state))
  const playerQueue = useAppSelector(state => populatedQueueSelector(state))

  const [ranksView, setRanksView] = useState(0)

  const draftPlayer = (playerId: string) => dispatch(draftPlayerThunk({ playerId }))
  const queuePlayer = (playerId: string) => dispatch(queuePlayerAction({ playerId }))
  const dequeuePlayer = (playerId: string) => dispatch(dequeuePlayerAction({ playerId }))
  const updateQueueOrder = (oldIndex: number, newIndex: number) => dispatch(updateQueueOrderAction({ oldIndex, newIndex }))
  const changeRanksView = () => setRanksView(ranksView < RANKS_VIEWS_ORDER.length - 1 ? ranksView + 1 : 0)
  const backButtonClick = () => {
    history.push('/drafts')
    dispatch(unloadDraft())
  }

  useEffect(() => {
    const draftId = match.params.draftId
    dispatch(loadDraftThunk(draftId))
  }, [dispatch, match.params.draftId])

  return (
    <div className={`DraftArena ${RANKS_VIEWS_ORDER[ranksView]}`}>
      <button className="back-button" onClick={backButtonClick}>
        <FontAwesomeIcon icon="chevron-left" size="2x"></FontAwesomeIcon>
      </button>
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
          queuePlayer={queuePlayer}
          dequeuePlayer={dequeuePlayer}
          playerQueue={playerQueue}
          updateQueueOrder={updateQueueOrder}
        />
      </div>
    </div>
  )
}