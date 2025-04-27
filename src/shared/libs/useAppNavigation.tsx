import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import {auth} from 'app/FireBaseConfig';
import {AllRoutes, Screens, Stacks} from 'app/navigation/navigationEnums';
import {RootStackParamsList} from 'app/navigation/navigationTypes';

type AuthNavigationProp = NavigationProp<RootStackParamsList> & {
  navigate: <T extends AllRoutes>(
    screenName: T,
    params?: T extends keyof RootStackParamsList
      ? RootStackParamsList[T]
      : never,
    options?: any,
  ) => void;
  unsafeNavigate: NavigationProp<RootStackParamsList>['navigate'];
  isAuthenticated: boolean;
};

export const useAppNavigation = (): AuthNavigationProp => {
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Обновляем состояние авторизации
      setIsAuthChecked(true); // Устанавливаем флаг, что проверка авторизации завершена
    });
    return unsubscribe;
  }, []);

  const navigateWithAuth = <T extends AllRoutes>(
    screenName: T,
    params?: T extends keyof RootStackParamsList
      ? RootStackParamsList[T]
      : never,
    options?: any,
  ) => {
    if (!isAuthChecked) {
      console.warn('Auth check not completed');
      return;
    }

    const publicScreens: AllRoutes[] = [Screens.LOGIN, Screens.REGISTER];

    // Разрешаем навигацию на публичные экраны без проверки
    if (publicScreens.includes(screenName)) {
      (navigation.navigate as any)(screenName, params, options);
      return;
    }

    // Для защищенных экранов проверяем авторизацию
    if (!isAuthenticated) {
      navigation.navigate(Screens.LOGIN, {
        redirectTo: screenName as string,
        ...(params ? {redirectParams: params} : {}),
      });
      return;
    }

    // Если пользователь авторизован - разрешаем навигацию
    (navigation.navigate as any)(screenName, params, options);
  };

  return {
    ...navigation,
    navigate: navigateWithAuth,
    unsafeNavigate: navigation.navigate,
    goBack: navigation.goBack,
    isAuthenticated,
  } as AuthNavigationProp;
};
