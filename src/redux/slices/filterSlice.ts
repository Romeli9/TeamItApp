import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import {ProjectType} from './projectsSlice';

export interface projectsState {
  categoryes: string[];
  requireds: string[];
  projects: ProjectType[];
}

const initialState: projectsState = {
  categoryes: [],
  requireds: [],
  projects: [],
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.categoryes = action.payload;
    },
    setRequired(state, action) {
      state.requireds = action.payload;
    },
    setStateProjects(state, action) {
      state.projects = action.payload;
    },
  },
});

export const {setCategory, setRequired, setStateProjects} = filterSlice.actions;

export default filterSlice.reducer;
