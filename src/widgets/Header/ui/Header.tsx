import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useOrientation} from 'shared/hooks';
import {ArrowBack, CartIcon, PlusIcon, SearchIcon} from 'shared/icons';
import {Colors, IconStyles, TextStyles} from 'shared/libs/helpers';

import {HeaderStyles as styles} from './Header.styles';

type HeaderProps = {
  hideBorder?: boolean;
  chatName?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export const Header = ({
  hideBorder,
  chatName,
  showBackButton = false,
  onBackPress,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaProvider>
      <View style={[styles.container, !hideBorder && styles.border]}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress}>
            <ArrowBack
              color={IconStyles.large.changeColor(Colors.Gray500).color}
              size={IconStyles.large.width}
            />
          </TouchableOpacity>
        )}
      </View>
      {chatName && (
        <View style={styles.chatTitle}>
          <Text style={TextStyles.p3.changeColor(Colors.Gray500)}>
            {chatName}
          </Text>
        </View>
      )}
    </SafeAreaProvider>
  );
};
