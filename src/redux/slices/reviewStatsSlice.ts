// src/redux/slices/reviewStatsSlice.ts
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {Review} from 'services/reviewsService';

import {fetchUserReviews} from './reviewsSlice';

export interface ReviewStats {
  avgTotal: number;
  avgHard: number;
  avgSoft: number;
  avgDeadlines: number;
  avgContribution: number;
  lastComments: string[];
}

const initialState: ReviewStats = {
  avgTotal: 0,
  avgHard: 0,
  avgSoft: 0,
  avgDeadlines: 0,
  avgContribution: 0,
  lastComments: [],
};

export const calculateReviewStats = createAsyncThunk<
  ReviewStats,
  {reviews: Review[]; userId: string}
>('reviewStats/calculate', async ({reviews, userId}) => {
  const hard: number[] = [];
  const soft: number[] = [];
  const deadlines: number[] = [];
  const contribution: number[] = [];
  const comments: string[] = [];

  for (const r of reviews) {
    if (r.toUserId !== userId) continue;
    if (r.hardSkills) hard.push(r.hardSkills);
    if (r.softSkills) soft.push(r.softSkills);
    if (r.deadlines) deadlines.push(r.deadlines);
    if (r.contribution) contribution.push(r.contribution);
    if (r.comment) comments.push(r.comment);
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    avgTotal: Number(
      avg([...hard, ...soft, ...deadlines, ...contribution]).toFixed(1),
    ),
    avgHard: Number(avg(hard).toFixed(1)),
    avgSoft: Number(avg(soft).toFixed(1)),
    avgDeadlines: Number(avg(deadlines).toFixed(1)),
    avgContribution: Number(avg(contribution).toFixed(1)),
    lastComments: comments.slice(-3).reverse(),
  };
});

const reviewStatsSlice = createSlice({
  name: 'reviewStats',
  initialState,
  reducers: {
    resetReviewStats: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchUserReviews.fulfilled, (state, action) => {
      const reviews = action.payload;
      const userId = reviews.length ? reviews[0].toUserId : '';
      if (!userId) return;

      const hard: number[] = [];
      const soft: number[] = [];
      const deadlines: number[] = [];
      const contribution: number[] = [];
      const comments: string[] = [];

      for (const r of reviews) {
        if (r.toUserId !== userId) continue;
        if (r.hardSkills) hard.push(r.hardSkills);
        if (r.softSkills) soft.push(r.softSkills);
        if (r.deadlines) deadlines.push(r.deadlines);
        if (r.contribution) contribution.push(r.contribution);
        if (r.comment) comments.push(r.comment);
      }

      const avg = (arr: number[]) =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

      state.avgTotal = Number(
        avg([...hard, ...soft, ...deadlines, ...contribution]).toFixed(1),
      );
      state.avgHard = Number(avg(hard).toFixed(1));
      state.avgSoft = Number(avg(soft).toFixed(1));
      state.avgDeadlines = Number(avg(deadlines).toFixed(1));
      state.avgContribution = Number(avg(contribution).toFixed(1));
      state.lastComments = comments.slice(-3).reverse();
    });
  },
});

export const {resetReviewStats} = reviewStatsSlice.actions;
export const selectReviewStats = (state: RootState) => state.reviewStats;
export default reviewStatsSlice.reducer;
