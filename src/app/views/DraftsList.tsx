import { FC, useEffect } from 'react'
import moment from 'moment'
import { UserDraft } from '../../models/draft'
import { getDraftsThunk } from '../../store/slices/draftArenaSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { populatedQbTierSelector } from '../../store/selectors/entitySelector'
import { draftsSelector } from '../../store/selectors/draftArenaSelector'

export const DraftsList: FC = () => {
  const dispatch = useAppDispatch()

  const drafts = useAppSelector(state => draftsSelector(state))
  const qbs = useAppSelector(state => populatedQbTierSelector(state))
  console.log(qbs)

  useEffect(() => {
    dispatch(getDraftsThunk())
  }, [dispatch])

  const goToDraft = (draftId: string) => {
    console.log('todo')
  }

  const createDraft = () => {
    console.log('create draft')
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
      <div className="list">
        {drafts && drafts.length
          ? renderDraftsList()
          : (
            <div className="no-drafts">
              <p>You haven't started any drafts.</p>
              <button onClick={createDraft}>Create a Draft</button>
            </div>
          )
        }
        </div>
      </div>
    </div>
  )
}