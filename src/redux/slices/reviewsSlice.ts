import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {
  Review,
  addReview as firestoreAddReview,
  getUserReviews,
} from 'services/reviewsService';

// 🔹 Получить отзывы конкретного пользователя
export const fetchUserReviews = createAsyncThunk<
  Review[], // что возвращаем
  string, // userId
  {rejectValue: string}
>('reviews/fetchUserReviews', async (userId, {rejectWithValue}) => {
  try {
    const reviews = await getUserReviews(userId);
    return reviews;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Добавить отзыв
export const addReviewThunk = createAsyncThunk<
  string, // возвращаем id нового отзыва
  Omit<Review, 'id' | 'createdAt'>, // входной payload
  {rejectValue: string}
>('reviews/addReview', async (review, {rejectWithValue}) => {
  try {
    const id = await firestoreAddReview(review);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

export const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    // fetchUserReviews
    builder.addCase(fetchUserReviews.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserReviews.fulfilled,
      (state, action: PayloadAction<Review[]>) => {
        state.reviews = action.payload;
        state.loading = false;
      },
    );
    builder.addCase(fetchUserReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Ошибка загрузки отзывов';
    });

    // addReviewThunk
    builder.addCase(addReviewThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(addReviewThunk.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(addReviewThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Ошибка добавления отзыва';
    });
  },
});

export const {clearReviews} = reviewsSlice.actions;

// 🔹 Селекторы
export const selectReviews = (state: RootState) => state.reviews.reviews;
export const selectReviewsLoading = (state: RootState) => state.reviews.loading;
export const selectReviewsError = (state: RootState) => state.reviews.error;

export default reviewsSlice.reducer;
