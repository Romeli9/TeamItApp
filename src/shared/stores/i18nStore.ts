import {create} from 'zustand';

type i18nStore = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useIsLoginStore = create<i18nStore>(set => ({
  language: 'ru',
  setLanguage: (language: string) => set({language}),
}));
