import {configureStore} from '@reduxjs/toolkit';

import filter from './slices/filterSlice';
import projects from './slices/projectsSlice';
import user from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user,
    projects,
    filter,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
