import {configureStore} from '@reduxjs/toolkit';

import user from './slices/userSlice';
import projects from './slices/projectsSlice';

export const store = configureStore({
  reducer: {
    user,
    projects,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
