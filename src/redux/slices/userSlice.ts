import {createSlice} from '@reduxjs/toolkit';

export interface userState {
  userId: string;
  userName: string;
  email: string;
  avatar: string;
  telegramm: string;
  HardSkills: string;
  SoftSkills: string;
  Role: string;
  experience: string;
  aboutMe: string;
  background: string;
}

const initialState: userState = {
  userId: '',
  userName: '',
  email: '',
  avatar: '',
  telegramm: '',
  HardSkills: '',
  SoftSkills: '',
  Role: '',
  experience: '',
  aboutMe: '',
  background: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userId = action.payload.userId;
      state.avatar = action.payload.avatar;
      state.background = action.payload.background;
      state.email = action.payload.email;
      state.userName = action.payload.username;
    },
    setProfileData(state, action) {
      state.aboutMe = action.payload.AboutMe;
      state.experience = action.payload.Experience;
      state.HardSkills = action.payload.HardSkills;
      state.SoftSkills = action.payload.SoftSkills;
      state.telegramm = action.payload.Telegramm;
      state.Role = action.payload.Role;
    },
    clearProfileData(state) {
      state.userId = '';
      state.avatar = '';
      state.background = '';
      state.email = '';
      state.userName = '';
    },
  },
});

export const {setUserData, setProfileData, clearProfileData} =
  userSlice.actions;

export default userSlice.reducer;
