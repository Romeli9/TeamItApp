import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ProjectType} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {Review} from 'services/reviewsService';

export interface AuthorStats {
  completionRate: number;
  avgTeamRating: number;
  leadershipComments: string[];
}

const initialState: AuthorStats = {
  completionRate: 0,
  avgTeamRating: 0,
  leadershipComments: [],
};

export const calculateAuthorStats = createAsyncThunk<
  AuthorStats, // тип возвращаемого значения при success
  {projects: ProjectType[]; reviews: Review[]; authorId: string}, // тип аргумента
  {rejectValue: string} // тип ошибки
>(
  'authorStats/calculate',
  async ({projects, reviews, authorId}, {rejectWithValue}) => {
    try {
      const authoredProjects = projects.filter(p => p.creatorId === authorId);

      const completed = authoredProjects.filter(p => p.status === 'completed');

      const authorReviews = reviews.filter(r => r.toUserId === authorId);

      const avg = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

      return {
        completionRate:
          authoredProjects.length > 0
            ? Math.round((completed.length / authoredProjects.length) * 100)
            : 0,
        avgTeamRating: Number(
          avg(authorReviews.map(r => r.hardSkills || 0)).toFixed(1),
        ),
        leadershipComments: authorReviews
          .filter(r => r.role === 'creator' && r.comment)
          .map(r => r.comment!)
          .slice(-3)
          .reverse(),
      };
    } catch (e) {
      return rejectWithValue('Ошибка при вычислении статистики автора');
    }
  },
);

const authorStatsSlice = createSlice({
  name: 'authorStats',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      calculateAuthorStats.fulfilled,
      (_, action) => action.payload,
    );
  },
});

export const selectAuthorStats = (state: RootState) => state.authorStats;
export default authorStatsSlice.reducer;
