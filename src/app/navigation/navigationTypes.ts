import {NavigatorScreenParams} from '@react-navigation/native';

export type MessengerRouteParams = {
  chatId: number;
  productName: string;
  sellerName: string;
};

export type RootStackParamsList = {
  Main: NavigatorScreenParams<MainTabsStackParamsList>;
  Auth: undefined;
  HomeTab: undefined;
  Messenger: undefined;
};

export type MainTabsStackParamsList = {
  HomeTab: NavigatorScreenParams<HomeStackParamsList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamsList>;
  ChatList: undefined;
};

export type HomeStackParamsList = {
  Home: undefined;
};

export type ProfileStackParamsList = {
  Profile: undefined;
};
