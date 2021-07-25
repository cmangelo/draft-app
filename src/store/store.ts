import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import draftArenaSlice from '../store/slices/draftArenaSlice'
import entitySlice from './slices/entitySlice';

export const store = configureStore({
  reducer: {
    draftArena: draftArenaSlice,
    entity: entitySlice
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
