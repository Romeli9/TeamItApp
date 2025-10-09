import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'redux/store';
import { projectTypes } from 'shared/assets/consts/ProjectTypes';
import {ProjectType} from './projectsSlice';

export interface projectsState {
  categoryes: string[];
  requireds: string[];
  projects: ProjectType[];
  searchSkills: string[]; // Для автоподбора навыков
  sortBy: string; // Для сортировки
  projectTypes: string[]; // Добавляем типы проектов
}

const initialState: projectsState = {
  categoryes: [],
  requireds: [],
  projects: [],
  projectTypes: [],
  searchSkills: [],
  sortBy: 'relevance', // relevance, date, popularity
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
    clearFilters(state) {
      state.categoryes = [];
      state.requireds = [];
    },
    
    // Добавляем новые редюсеры без изменения существующих
    setProjectTypes: (state, action: PayloadAction<string[]>) => {
      state.projectTypes = action.payload;
    },
    setSearchSkills: (state, action: PayloadAction<string[]>) => {
      state.searchSkills = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    resetAllFilters: (state) => {
      state.categoryes = [];
      state.requireds = [];
      state.projectTypes = [];
      state.searchSkills = [];
      state.sortBy = 'relevance';
    },
    addSearchSkill: (state, action: PayloadAction<string>) => {
      if (!state.searchSkills.includes(action.payload)) {
        state.searchSkills.push(action.payload);
      }
    },
    removeSearchSkill: (state, action: PayloadAction<string>) => {
      state.searchSkills = state.searchSkills.filter(skill => skill !== action.payload);
    },
    toggleProjectType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      if (state.projectTypes.includes(type)) {
        state.projectTypes = state.projectTypes.filter(item => item !== type);
      } else {
        state.projectTypes.push(type);
      }
    },
  },
});

export const {
  setCategory, 
  setRequired, 
  setStateProjects, 
  clearFilters,
  // Экспортируем новые экшены
  setProjectTypes,
  setSearchSkills,
  setSortBy,
  resetAllFilters,
  addSearchSkill,
  removeSearchSkill,
  toggleProjectType,
} = filterSlice.actions;

export default filterSlice.reducer;