import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {useOrientation} from 'shared/hooks';
import {ArrowBack, CartIcon, PlusIcon, SearchIcon} from 'shared/icons';
import {Colors, IconStyles, TextStyles} from 'shared/libs/helpers';

import {HeaderStyles as styles} from './Header.styles';

type HeaderProps = {
  showTitle?: boolean;
  searchText?: string;
  hideBorder?: boolean;
  showAddButton?: boolean;
  showBackButton?: boolean;
  showCartButton?: boolean;
  showSearchInput?: boolean;
  productName?: string;
  sellerName?: string;
  onSearch?: () => void;
  onAddPress?: () => void;
  onBackPress?: () => void;
  onCartPress?: () => void;
  onClearSearch?: () => void;
  setSearchText?: (text: string) => void;
};

export const Header = ({
  showTitle,
  hideBorder,
  sellerName,
  productName,
  showBackButton = false,
  showCartButton = false,
  showSearchInput = false,
  showAddButton = false,
  searchText = '',
  setSearchText,
  onBackPress,
  onCartPress,
  onAddPress,
  onSearch,
  onClearSearch,
}: HeaderProps) => {
  return (
    <View style={[styles.container, !hideBorder && styles.border]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress}>
          <ArrowBack
            fill={IconStyles.medium.changeColor(Colors.Gray500).color}
            width={IconStyles.medium.width}
            height={IconStyles.medium.height}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
