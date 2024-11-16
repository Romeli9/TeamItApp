import {NavigationProp, useNavigation} from '@react-navigation/native';

import {RootStackParamsList} from 'app/navigation/navigationTypes';

export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamsList>>();
};
