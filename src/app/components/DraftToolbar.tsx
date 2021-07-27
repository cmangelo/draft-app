import { FC, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PickState } from '../../store/slices/draftArenaSlice'

type DraftToolbarProps = {
  state: PickState
  changeRanksView: () => void
  viewIcon: string
}

export const DraftToolbar: FC<DraftToolbarProps> = ({
  state,
  changeRanksView,
  viewIcon
}) => {
  const {
    overall,
    currRound,
    roundPick
  } = state
  const [dropdownClosed, setDropdownClosed] = useState(true)

  return (
    <div className="DraftToolbar">
      <div className="numbers" onClick={() => setDropdownClosed(!dropdownClosed)}>
        <div className="inner">
          <p><span>Overall </span>{overall}</p>
          <p><span>Round </span>{currRound}</p>
          <p><span>Pick </span>{roundPick}</p>
        </div>
        {/* className={`icon ${!dropdownClosed ? 'flip' : ''}`}  */}
      </div>
      <div className="icon-container" onClick={changeRanksView}>
        <FontAwesomeIcon icon="chevron-down" className={`icon ${viewIcon}`} />
      </div>
      {/* TODO: toggle to hide/show drafted players */}
        {/* <div className={`buttons ${dropdownClosed ? 'closed' : ''}`}>
            <button className="defense" onClick={draftDefense}>Draft Defense</button>
            <button className="kicker" onClick={draftKicker}>Draft Kicker</button>
        </div> */}
    </div>
);
}