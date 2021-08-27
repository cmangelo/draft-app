import { ChangeEvent, FC } from 'react'
import { PlayerPosition } from '../../../models/player'
import { VisiblePositions } from '../../views/userRanks/UserRanks'

type GroupSelectorProps = {
  groupVisibility: VisiblePositions
  togglePositionVisible: (position: PlayerPosition) => void 
}

export const GroupSelector: FC<GroupSelectorProps> = ({
  groupVisibility,
  togglePositionVisible
}) => {

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value)
      togglePositionVisible(e.target.value as PlayerPosition)
  }

  return (
    <div className="GroupSelector">
      {Object.keys(groupVisibility).map((key: string) => {
        const inputId = "i" + key
        return (
          <div key={key}>
            <input type="radio"
              id={inputId}
              value={key}
              onChange={handleCheckbox}
              checked={groupVisibility[key as PlayerPosition]} />
            <label htmlFor={inputId}>{key}</label>
          </div>
        )
      })}
    </div>
  );
}