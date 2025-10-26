import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {Review} from 'services/reviewsService';

import {ProjectType} from './projectsSlice';

export interface Achievement {
  id: string;
  name: string;
  type: 'user' | 'author' | 'team';
}

interface AchievementsState {
  badges: Achievement[];
}

const initialState: AchievementsState = {
  badges: [],
};

export const calculateAchievements = createAsyncThunk<
  Achievement[],
  {projects: ProjectType[]; reviews: Review[]; userId: string}
>('achievements/calculate', async ({projects, reviews, userId}) => {
  const userReviews = reviews.filter(r => r.toUserId === userId);

  const authoredProjects = projects.filter(p => p.creatorId === userId);
  const completedProjects = authoredProjects.filter(
    p => p.status === 'completed',
  );

  const avgRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, r) => sum + (r.hardSkills ?? 0), 0) /
        userReviews.length
      : 0;

  const badges: Achievement[] = [];

  // 🔹 Участники
  if (avgRating >= 4.5)
    badges.push({id: 'reliable', name: 'Надёжный участник', type: 'user'});
  if (completedProjects.length >= 3)
    badges.push({
      id: 'three_projects',
      name: '3 завершённых проекта',
      type: 'user',
    });
  if (
    userReviews.filter(r => (r.comment || '').toLowerCase().includes('спасибо'))
      .length >= 10
  )
    badges.push({
      id: 'positive10',
      name: '10 положительных отзывов',
      type: 'user',
    });

  // 🔹 Авторы
  if (completedProjects.length >= 5)
    badges.push({id: 'leader5', name: 'Опытный лидер', type: 'author'});
  if (avgRating >= 4.5)
    badges.push({id: 'organizer', name: 'Хороший организатор', type: 'author'});

  return badges;
});

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(calculateAchievements.fulfilled, (_, action) => ({
      badges: action.payload,
    }));
  },
});

export const selectAchievements = (state: RootState) =>
  state.achievements.badges;
export default achievementsSlice.reducer;
