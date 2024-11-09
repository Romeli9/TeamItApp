import {create} from 'zustand';
import axios from 'axios';
import { User } from 'entities/user';

type Review = {
  id: number;
  rating: number;
  userid: number;
  productid: number;
  user: User;
}

type ReviewStore = {
  userRating: number;
  hasReview: boolean;
  reviews: Review[];

  setHasReview(value: boolean): void;

  setUserRating: (userRating : number) => void;

  makeReview: (userid: number, productid: number, rating: number) => Promise<void>;
  putReview: (userid: number, productid: number, rating: number) => Promise<void>;
  getReview: (productid: number, userid: number) => Promise<void>;
};

export const useReviewStore = create<ReviewStore>(set => ({
  userRating: 0,
  hasReview: false,
  reviews: [],

  setHasReview: (value: boolean) => {
    set({hasReview: value});
  },

  setUserRating: (userRating: number) => {
    set({userRating});
  },

  makeReview: async (userid: number, productid: number, rating: number) => {
    try {
      const {data} = await axios.post('https://domennameabcdef.ru/api/reviews',{
        userid,
        productid,
        rating,
      });
      return data;
    } catch (error: any) {
      console.error(error.response);
    }
  },

  putReview: async (userid: number, productid: number, rating: number) => {
    try {
      const {data} = await axios.put('https://domennameabcdef.ru/api/reviews',{
        userid,
        productid,
        rating,
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  getReview: async (productid: number, userid: number) => {
    try {
      const {data} = await axios.get(`https://domennameabcdef.ru/api/reviews/${productid}`);
      const review = data.find((review: Review) => review.userid === userid)
      set({hasReview: review ? true : false});
      set({userRating: review ? review.rating : 0});
      set({reviews: data});
    } catch (error) {
      console.error(error);
    }
  },
}));
