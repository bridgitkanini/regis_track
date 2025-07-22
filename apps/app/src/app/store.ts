import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from '../features/auth/authApi';
import { membersApi } from '../features/members/membersApi';
import { activityApi } from '../features/activity/activityApi';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(membersApi.middleware)
      .concat(activityApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Set up listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
