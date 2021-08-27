import { ChangeEvent, FC } from 'react'

// import { EPosition } from '../models/enums/position.enum';

type GroupSelectorProps = {
  visibleGroups: { [key: string]: boolean }
  togglePositionVisible: (position: string) => void 
}

export const GroupSelector: FC<GroupSelectorProps> = ({
  visibleGroups,
  togglePositionVisible
}) => {

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    if (e.target.value)
      togglePositionVisible(e.target.value);
  }

  return (
    <div className="GroupSelector">
      {Object.keys(visibleGroups).map((key: string) => {
        const group = parseInt(key)
        const inputId = "i" + key
        return (
          <div key={key}>
            <input type="radio"
              id={inputId}
              value={key}
              onChange={handleCheckbox}
              checked={visibleGroups[key]} />
            <label htmlFor={inputId}>{key}</label>
          </div>
        )
      })}
    </div>
  );
}