import {configureStore} from '@reduxjs/toolkit';

import filter from './slices/filterSlice';
import projects from './slices/projectsSlice';
import reviewsReducer from './slices/reviewsSlice';
import user from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user,
    projects,
    filter,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
