import {configureStore} from '@reduxjs/toolkit';

import achievementsReducer from './slices/achievementsSlice';
import authorStatsReducer from './slices/authorStatsSlice';
import filter from './slices/filterSlice';
import projects from './slices/projectsSlice';
import reviewStatsReducer from './slices/reviewStatsSlice';
import reviewsReducer from './slices/reviewsSlice';
import user from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user,
    projects,
    filter,
    reviews: reviewsReducer,
    reviewStats: reviewStatsReducer,
    authorStats: authorStatsReducer,
    achievements: achievementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
