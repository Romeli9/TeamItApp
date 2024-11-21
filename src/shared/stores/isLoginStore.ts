import {create} from 'zustand';

type isLoginStore = {
  isLoginPage: boolean;
  setIsLoginPage: (isLoginPage: boolean) => void;
};

export const useIsLoginStore = create<isLoginStore>(set => ({
  isLoginPage: true,
  setIsLoginPage: (isLoginPage: boolean) => set({isLoginPage}),
}));
