import { FC, FormEvent } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import { loginUser } from '../../../store/slices/userSlice'

export const Login: FC = () => {
  const dispatch = useAppDispatch()

  const onLoginFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.target as any
    const username = target.elements.username.value.trim()
    dispatch(loginUser(username))
  }

  return (
    <div className="Login">
      <img src={process.env.PUBLIC_URL + 'img/default-monochrome.svg'} alt="" />
      {/* <div className="toggle"> */}
          {/* <span className="active">Log In</span> */}
          {/* <span className={!showLogin ? 'active' : ''} onClick={() => setShowLogin(false)}>Create Account</span> */}
      {/* </div> */}
      <form action="" onSubmit={onLoginFormSubmit}>
          <input type="text" placeholder="Username" name="username" />
          {/* <input type="password" placeholder="Password" name="password" /> */}
          {/* <div className="error-message">{errorMessage}</div> */}
          <button type="submit">Submit</button>
      </form>
      
      {/* {!showLogin &&
          <form action="" onSubmit={onCreateAccountFormSubmit}>
              <input type="text" placeholder="Name" name="name" />
              <input type="text" placeholder="Username" name="username" />
              <input type="password" placeholder="Password" name="password" />
              <div className="error-message">{errorMessage}</div>
              <button type="submit">Submit</button>
          </form>
      } */}
  </div>
  )
}