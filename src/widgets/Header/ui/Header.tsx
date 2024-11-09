import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View} from 'react-native';

import {useOrientation} from 'shared/hooks';
import {ArrowBack, CartIcon, PlusIcon, SearchIcon} from 'shared/icons';
import {Colors, IconStyles, TextStyles} from 'shared/libs/helpers';
import {Input} from 'shared/ui';

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
  const {t} = useTranslation();
  return (
    <View style={[styles.container, !hideBorder && styles.border]}>
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          accessible={true}
          accessibilityLabel={t('Вернуться на предыдущий экран')}>
          <ArrowBack
            fill={IconStyles.medium.changeColor(Colors.Gray500).color}
            width={IconStyles.medium.width}
            height={IconStyles.medium.height}
          />
        </TouchableOpacity>
      )}

      {showTitle && (
        <Text
          style={TextStyles.p3.changeColor(Colors.Green500)}
          accessible={true}
          accessibilityLabel={t('Маркетплейс GOZON')}>
          GOZON
        </Text>
      )}

      {showSearchInput && setSearchText && (
        <>
          <Input
            showClear={true}
            value={searchText}
            style={styles.input}
            containerStyle={styles.inputContainerStyle}
            placeholder={t('Поиск...')}
            setValue={setSearchText}
            onClear={onClearSearch}
            accessibilityLabel={t('Поле для поиска')}
          />
          <TouchableOpacity
            onPress={onSearch}
            accessible={true}
            accessibilityLabel={t('Начать поиск')}>
            <SearchIcon
              fill={IconStyles.medium.changeColor(Colors.Gray500).color}
              width={IconStyles.medium.width}
              height={IconStyles.medium.height}
            />
          </TouchableOpacity>
        </>
      )}

      {showCartButton && (
        <TouchableOpacity
          onPress={onCartPress}
          accessible={true}
          accessibilityLabel={t('Корзина')}>
          <CartIcon
            fill={IconStyles.medium.changeColor(Colors.Gray500).color}
            width={IconStyles.medium.width}
            height={IconStyles.medium.height}
          />
        </TouchableOpacity>
      )}

      {showAddButton && (
        <TouchableOpacity
          onPress={onAddPress}
          accessible={true}
          accessibilityLabel={t('Добавить продукт')}>
          <PlusIcon
            fill={IconStyles.medium.changeColor(Colors.Gray500).color}
            width={IconStyles.medium.width}
            height={IconStyles.medium.height}
          />
        </TouchableOpacity>
      )}

      {sellerName && productName && (
        <View
          style={styles.chatTitle}
          accessible={true}
          accessibilityLabel={`${t('Ваш собеседник в чате')}: ${t(
            sellerName,
          )}`}>
          <Text style={TextStyles.p3.changeColor(Colors.Green500)}>
            {sellerName}
          </Text>
          <Text style={TextStyles.span1.changeColor(Colors.Gray500)}>
            {productName}
          </Text>
        </View>
      )}
    </View>
  );
};
