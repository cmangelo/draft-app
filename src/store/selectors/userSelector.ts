import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../store'

const userStateSelector = (state: RootState) => state.user

export const usernameSelector = createSelector(userStateSelector, user => user.username)