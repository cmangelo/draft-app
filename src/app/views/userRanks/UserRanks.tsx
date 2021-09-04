import { FC, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { PlayerPosition,  Positions } from '../../../models/player'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { changesSinceLastSaveSelector, populatedTierSelector } from '../../../store/selectors/entitySelector'
import { getRanksThunk } from '../../../store/slices/draftArenaSlice'
import { TierBucket } from '../../components/userRanks/TierBucket'
import { 
  insertTier as insertTierAction, 
  deleteTier as deleteTierAction,
  updatePlayerRank as updatePlayerRankAction,
  saveRanksThunk
 } from '../../../store/slices/entitySlice' 
import { GroupSelector } from '../../components/ranks/GroupSelector'

export type VisiblePositions = Positions<boolean>

export const UserRanks: FC = () => {
  const dispatch = useAppDispatch()
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition>(PlayerPosition.QB)
  const [positions, setPositions] = useState<VisiblePositions>({ 
    [PlayerPosition.QB]: true, 
    [PlayerPosition.RB]: false, 
    [PlayerPosition.WR]: false, 
    [PlayerPosition.TE]: false 
  })
  const rankings = useAppSelector(state => populatedTierSelector(state))
  const changesSinceLastSave = useAppSelector(state => changesSinceLastSaveSelector(state))
  
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

  const renderGroups = () => {
    if (!rankings) return

    const selectedPositionTiers = rankings[selectedPosition]

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

  const onPositionChange = (position: PlayerPosition) => {
    setPositions({
      ...positions,
      [selectedPosition]: false,
      [position]: true
    })
    setSelectedPosition(position)
  }

  const onSaveClick = () => {
    dispatch(saveRanksThunk({position: selectedPosition}))
  }

  return (
    <div className="UserRanks">
      <header>
        <GroupSelector groupVisibility={positions} togglePositionVisible={onPositionChange}></GroupSelector>
        <button 
          onClick={onSaveClick}
          disabled={!changesSinceLastSave[selectedPosition]}>Save</button>
      </header>
      <div className="ranks">
        <DragDropContext onDragEnd={onDragEnd}>
          {renderGroups()}
        </DragDropContext>
      </div>
    </div>
  )
}