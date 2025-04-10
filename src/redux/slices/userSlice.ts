import {createSlice} from '@reduxjs/toolkit';

export interface userState {
  userId: string;
  userName: string;
  email: string;
  avatar: string;
  telegramm: string;
  skills: string;
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
  skills: '',
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
      state.skills = action.payload.Skills;
      state.telegramm = action.payload.Telegramm;
    },
  },
});

export const {setUserData, setProfileData} = userSlice.actions;

export default userSlice.reducer;
