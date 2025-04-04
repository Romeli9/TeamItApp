import {NavigatorScreenParams} from '@react-navigation/native';

import {Screens, Stacks} from './navigationEnums';

export type ProjectRouteParams = {
  projectId: string;
};

export type MessengerRouteParams = {
  chatId: string;
  chatName: string;
};

export type ProfileRouteParams = {
  userId?: string;
};

export type RootStackParamsList = {
  [Screens.LOGIN]:
    | undefined
    | {
        redirectTo: string;
        redirectParams?: any;
      };
  [Screens.REGISTER]: undefined;
  [Stacks.MAIN]: NavigatorScreenParams<MainTabsStackParamsList>;
  [Screens.MESSENGER]: MessengerRouteParams;
  [Screens.PROJECT]: ProjectRouteParams;
  [Screens.PROJECT_REQUESTS]: undefined;
};

export type MainTabsStackParamsList = {
  [Stacks.HOME_TAB]: NavigatorScreenParams<HomeStackParamsList>;
  [Stacks.PROFILE_TAB]: NavigatorScreenParams<ProfileStackParamsList>;
  [Screens.CHATLIST]: undefined;
};

export type HomeStackParamsList = {
  [Screens.HOME]: undefined;
  [Screens.SEARCH]: undefined;
};

export type ProfileStackParamsList = {
  [Screens.PROFILE]: undefined;
  [Screens.VIEW_PROFILE]: ProfileRouteParams;
};
