import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import draftArenaSlice from '../store/slices/draftArenaSlice'
import entitySlice from './slices/entitySlice'

export const history = createBrowserHistory()

export const store = configureStore({
  reducer: {
    draftArena: draftArenaSlice,
    entity: entitySlice,
    router: connectRouter(history),
  },
  middleware: getDefaultMiddleware().concat(routerMiddleware(history)),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
