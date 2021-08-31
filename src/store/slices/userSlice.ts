import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type UserState = {
  username: string | null
}

const initialState: UserState = {
  username: localStorage.getItem('username')
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload
      localStorage.setItem('username', action.payload)
    },
    logoutUser: (state) => {
      state.username = null
      localStorage.removeItem('username')
    }
  }
})

export const { loginUser,logoutUser } = userSlice.actions

export default userSlice.reducer