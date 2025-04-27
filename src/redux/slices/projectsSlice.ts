import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Skill} from 'components';
import {RootState} from 'redux/store';

export type ProjectType = {
  id: string;
  creator: string;
  creatorId: string;
  description: string;
  name: string;
  photo: string;
  required: string[];
  categories: string[];
  skills: Skill[];
  members: string[];
};

export interface projectsState {
  yourProjects: ProjectType[];
  otherProjects: ProjectType[];
}

const initialState: projectsState = {
  yourProjects: [],
  otherProjects: [],
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setYourProjects(state, action: PayloadAction<ProjectType[]>) {
      state.yourProjects = action.payload;
    },
    setOtherProjects(state, action: PayloadAction<ProjectType[]>) {
      state.otherProjects = action.payload;
    },
    clearProjects(state) {
      state.yourProjects = [];
      state.otherProjects = [];
    },
  },
});

export const {setYourProjects, setOtherProjects, clearProjects} =
  projectsSlice.actions;

export const selectProjectById = (projectId: string) => (state: RootState) => {
  return (
    state.projects.yourProjects.find(project => project.id === projectId) ||
    state.projects.otherProjects.find(project => project.id === projectId)
  );
};

export default projectsSlice.reducer;
