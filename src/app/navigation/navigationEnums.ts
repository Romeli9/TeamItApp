export enum Stacks {
  MAIN = 'Main',
  HOME_TAB = 'HomeTab',
  PROFILE_TAB = 'ProfileTab',
}

export enum Screens {
  HOME = 'Home',
  PROFILE = 'Profile',
  LOGIN = 'Login',
  REGISTER = 'Register',
  CHATLIST = 'ChatList',
  MESSENGER = 'Messenger',
  PROJECT = 'Project',
  SEARCH = 'Search',
}

export type AllRoutes = Screens | Stacks;
