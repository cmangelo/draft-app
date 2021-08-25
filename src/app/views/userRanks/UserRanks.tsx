import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AllTiers } from '../../../models/player'
import { useAppSelector } from '../../../store/hooks'
import { populatedTierSelector } from '../../../store/selectors/entitySelector'
import { getRanksThunk } from '../../../store/slices/draftArenaSlice'
import { PositionRanks } from '../../components/ranks/PositionRanks'

export const UserRanks: FC = () => {
  const dispatch = useDispatch()
  const rankings = useAppSelector(state => populatedTierSelector(state))
  useEffect(() => {
    dispatch(getRanksThunk({
      QB: 'USER',
      RB: 'USER',
      WR: 'USER',
      TE: 'USER',
    }))
  }, [])

  const renderGroups = () => {
    if (!rankings) return

    return Object.values(rankings).map((positionRanks, index) => {
      if (!positionRanks || !positionRanks.length) return null
      return (
        <PositionRanks
          key={positionRanks[0].playerPosition}
          ranks={positionRanks}
          position={positionRanks[0].playerPosition} 
          />
      )
    })
  }

  return (
    <div className="UserRanks">
      <div className="ranks">
        {renderGroups()}
      </div>
    </div>
  )
}