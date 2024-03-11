import * as Font from 'expo-font';

// Загружаем шрифты
export const loadFonts = async () => {
  await Font.loadAsync({
    'Inter-Black': require('./Inter-Black.ttf'),
    'Inter-Bold': require('./Inter-Bold.ttf'),
    'Inter-ExtraBold': require('./Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('./Inter-ExtraLight.ttf'),
    'Inter-Light': require('./Inter-Light.ttf'),
    'Inter-Medium': require('./Inter-Medium.ttf'),
    'Inter-Regular': require('./Inter-Regular.ttf'),
    'Inter-SemiBold': require('./Inter-SemiBold.ttf'),
    'Inter-Thin': require('./Inter-Thin.ttf'),
  });
};
