import {NavigatorScreenParams} from '@react-navigation/native';

export type ProjectRouteParams = {
  projectId: string;
};

export type MessengerRouteParams = {
  chatId: string;
  chatName: string;
};

export type RootStackParamsList = {
  Main: NavigatorScreenParams<MainTabsStackParamsList>;
  Auth: undefined;
  Register: undefined;
  Login: undefined;
  HomeTab: undefined;
  Messenger: MessengerRouteParams;
  Project: NavigatorScreenParams<ProjectRouteParams>;
};

export type MainTabsStackParamsList = {
  HomeTab: NavigatorScreenParams<HomeStackParamsList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamsList>;
  ChatList: undefined;
};

export type HomeStackParamsList = {
  Home: undefined;
  Search: undefined;
};

export type ProfileStackParamsList = {
  Profile: undefined;
};
