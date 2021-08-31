import { FC } from 'react'
import { useHistory } from 'react-router'
import { useAppSelector } from '../../../store/hooks'
import { usernameSelector } from '../../../store/selectors/userSelector'
import { Login } from '../../components/login/Login'

export const Landing: FC = () => {
  const history = useHistory()
  const isUserLoggedIn = useAppSelector(state => usernameSelector(state))

  if (isUserLoggedIn)
    history.push('/drafts')

  return (
    <div className="LandingPage">
      <div className="images">
          <img className="laptop" src={process.env.PUBLIC_URL + 'img/laptopranks.png'} alt="img" />
          <img className="phone" src={process.env.PUBLIC_URL + 'img/iphone8userRanks.png'} alt="img" />
          <div className="text">
              <h1>Drafting made easy</h1>
              <span>Take control of your next fantasy draft with the best tiered ranking draft tracker on the web</span>
          </div>
      </div>
      <Login />
  </div>
  )
} 