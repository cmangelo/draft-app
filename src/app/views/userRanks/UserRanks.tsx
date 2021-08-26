import { FC, useEffect, useState } from 'react'
import { PopulatedTier } from '../../../models/player'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { getRanksThunk } from '../../../store/slices/draftArenaSlice'
import { TierBucket } from '../../components/userRanks/TierBucket'
import { insertTier as insertTierAction, deleteTier as deleteTierAction } from '../../../store/slices/entitySlice' 

export const UserRanks: FC = () => {
  const dispatch = useAppDispatch()
  const [selectedPosition, setSelectedPosition] = useState('QB')
  const rankings = useAppSelector(state => populatedTierSelector(state))
  
  const insertTier = (insertAfter: number) =>
    dispatch(insertTierAction({ position: selectedPosition, insertAfter}))

  const deleteTier = (tierNumber: number) =>
    dispatch(deleteTierAction({ position: selectedPosition, tierNumber }))

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
      <TierBucket 
        key={tier.tierNumber} 
        tier={tier}
        insertTier={insertTier}
        deleteTier={deleteTier}
      />
    ))
  }


  return (
    <div className="UserRanks">
      <div className="ranks">
        {renderGroups()}
      </div>
    </div>
  )
}