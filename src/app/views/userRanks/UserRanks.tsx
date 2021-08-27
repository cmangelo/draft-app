import { FC, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { PopulatedTier } from '../../../models/player'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { getRanksThunk } from '../../../store/slices/draftArenaSlice'
import { TierBucket } from '../../components/userRanks/TierBucket'
import { 
  insertTier as insertTierAction, 
  deleteTier as deleteTierAction,
  updatePlayerRank as updatePlayerRankAction,
  saveRanksThunk
 } from '../../../store/slices/entitySlice' 
import { GroupSelector } from '../../components/ranks/GroupSelector'

export const UserRanks: FC = () => {
  const dispatch = useAppDispatch()
  const [selectedPosition, setSelectedPosition] = useState('QB')
  const [positions, setPositions] = useState({ 'QB': true, 'RB': false, 'WR': false, 'TE': false })
  const rankings = useAppSelector(state => populatedTierSelector(state))
  
  const insertTier = (insertAfter: number) =>
    dispatch(insertTierAction({ position: selectedPosition, insertAfter}))

  const deleteTier = (tierNumber: number) =>
    dispatch(deleteTierAction({ position: selectedPosition, tierNumber }))

  const onDragEnd = (result: DropResult) => {
    if (result.destination)
      dispatch(updatePlayerRankAction({
        position: selectedPosition,
        startTier: +result.source.droppableId,
        endTier: +result.destination.droppableId,
        startIndex: result.source.index,
        endIndex: result.destination.index
      })) 
  }

  useEffect(() => {
    dispatch(getRanksThunk({
      QB: 'USER',
      RB: 'USER',
      WR: 'USER',
      TE: 'USER',
    }))
  }, [dispatch])

  const getSelectedPositionTiers = (): PopulatedTier[] => {
    switch(selectedPosition) {
      case 'QB':
        return rankings.qbTiers
      case 'RB':
        return rankings.rbTiers
      case 'WR':
        return rankings.wrTiers
      case 'TE':
        return rankings.teTiers
      default:
        return rankings.qbTiers
    }
  }

  const renderGroups = () => {
    if (!rankings) return

    const selectedPositionTiers = getSelectedPositionTiers()

    return selectedPositionTiers.map(tier => (
      <Droppable key={tier.tierNumber} droppableId={tier.tierNumber.toString()}>
        {provided => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}>
            <TierBucket 
              key={tier.tierNumber} 
              tier={tier}
              insertTier={insertTier}
              deleteTier={deleteTier}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ))
  }

  const onPositionChange = (position: string) => {
    setPositions({
      ...positions,
      [selectedPosition]: false,
      [position]: true
    })
    setSelectedPosition(position)
  }

  const onSaveClick = () => {
    dispatch(saveRanksThunk())
  }

  return (
    <div className="UserRanks">
      <header>
        <GroupSelector visibleGroups={positions} togglePositionVisible={onPositionChange}></GroupSelector>
        <button onClick={onSaveClick}>Save</button>
      </header>
      <div className="ranks">
        <DragDropContext onDragEnd={onDragEnd}>
          {renderGroups()}
        </DragDropContext>
      </div>
    </div>
  )
}