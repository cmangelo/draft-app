import { FC, useEffect } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { UserDraft } from '../../../models/draft'
import { getDraftsThunk } from '../../../store/slices/draftArenaSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { draftsSelector } from '../../../store/selectors/draftArenaSelector'

export const DraftsList: FC = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const drafts = useAppSelector(state => draftsSelector(state))

  useEffect(() => {
    dispatch(getDraftsThunk())
  }, [dispatch])

  const goToDraft = (draftId: string) => {
    history.push(`/drafts/${draftId}`)
  }

  const createDraft = () => {
    history.push('/drafts/create')
  }

  const renderDraftsList = () => {
    if (!drafts) return;
    return drafts.map((draft: UserDraft) => {
      return (
        <div key={draft.draftId} className="draft-list-item" onClick={() => goToDraft(draft.draftId)}>
          <div className="left">
            <span>{draft.draftName}</span>
          </div>
          <div className="right">
            <span className="date">{moment(draft.draftDateTime).format('M/D/YY')}</span>
            <span className="time">{moment(draft.draftDateTime).format('h:mma')}</span>
          </div>
          <span></span>
        </div>
      );
    });
}

  return (
    <div className="DraftsList">
      <div>
        <h1>My Drafts</h1>
        <button onClick={createDraft}>Create a Draft</button>
        <div className="list">
          {drafts && drafts.length
            ? renderDraftsList()
            : (
              <div className="no-drafts">
                <p>You haven't started any drafts.</p>
              </div>
            )
          }
          </div>
      </div>
    </div>
  )
}