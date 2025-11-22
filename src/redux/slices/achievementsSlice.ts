import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAchievements} from 'api/AchievementsService';
import {RootState} from 'redux/store';
import {Review} from 'services/reviewsService';

import {ProjectType} from './projectsSlice';

export interface Achievement {
  id: string;
  name: string;
  icon?: string;
  type: 'user' | 'author' | 'team';
  progress: number; // 0-100%
  secret?: boolean; // секретная ачивка
}

interface AchievementsState {
  badges: Achievement[];
  loading: boolean;
  error: string | null;
}

const initialState: AchievementsState = {
  badges: [],
  loading: false,
  error: null,
};

export const fetchAchievements = createAsyncThunk<
  Achievement[],
  {userId: string; projects: ProjectType[]; reviews: Review[]}
>('achievements/fetch', async ({userId, projects, reviews}, thunkApi) => {
  try {
    const data = await getAchievements({userId, projects, reviews});
    console.log(data);

    return data.achievements.map((a: any) => ({
      id: a.id,
      name: a.title || a.name,
      description: a.description || '',
      type: a.type || 'user',
      progress: a.progress ?? 0,
      secret: a.secret ?? false,
    }));
  } catch (err: any) {
    return thunkApi.rejectWithValue(err.message);
  }
});

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAchievements.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.badges = action.payload;
        state.loading = false;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAchievements = (state: RootState) =>
  state.achievements.badges;

export const selectAchievementsLoading = (state: RootState) =>
  state.achievements.loading;

export const selectAchievementsError = (state: RootState) =>
  state.achievements.error;

export default achievementsSlice.reducer;
