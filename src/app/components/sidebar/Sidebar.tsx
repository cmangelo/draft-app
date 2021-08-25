import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: FC = () => {
  // const dispatch = useDispatch()
  const isUserLoggedIn: boolean = true //useSelector(getIsUserLoggedIn)
  const location = useLocation()
  const locationSegments = location.pathname.split('/')

  const inDraft = () => {
    return locationSegments[1] === 'drafts' && locationSegments.length > 2 && locationSegments[2] !== 'create'
  }

  const isActiveLink = (link: string, lastOnly?: boolean) => {
    if (lastOnly)
        return locationSegments[locationSegments.length - 1] === link
    return locationSegments.some(segment => segment === link)
  }

  // const logoutUser = () => {
  //   dispatch(logoutUserAction())
  //   props.history.push('/login')
  // }

  return isUserLoggedIn && !inDraft() ? (
    <div className="Sidebar">
      <nav>
        <Link to="/drafts" className={isActiveLink('drafts', true) ? 'active' : ''}>
          <FontAwesomeIcon icon="list" className="icon" />
          <div>Drafts</div>
        </Link>
        <Link to="/drafts/create" className={isActiveLink('create', true) ? 'active' : ''}>
          <FontAwesomeIcon icon={["far", "plus-square"]} className="far icon" />
          <div>New Draft</div>
        </Link>
        <Link to="/players" className={isActiveLink('players') ? 'active' : ''}>
          <FontAwesomeIcon icon="pencil-alt" className="icon" />
          <div>My Ranks</div>
        </Link>
        {/* <Link to="/login" onClick={logoutUser}>
          <FontAwesomeIcon icon="sign-out-alt" className="icon" />
          <div>Log Out</div>
        </Link> */}
      </nav>
    </div>
  ) : (
    <></>
  )
}