import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {LinearGradient} from 'expo-linear-gradient';
import {BellIcon, SearchIcon} from 'shared/assets/icons/icons';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

export const HeaderMessenger = () => {
  const {navigate} = useAppNavigation();

  return (
    <LinearGradient
      style={styles.container}
      colors={['rgba(114, 47, 181, 0.29)', 'rgba(200, 178, 246, 1)']}>
      <TouchableOpacity style={styles.iconMargin}>
        <SearchIcon style={{width: 32, height: 32}} />
      </TouchableOpacity>
      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={() => {
            navigate(Screens.PROJECT_LIST_REQUESTS);
          }}
          style={styles.iconMargin}>
          <BellIcon style={{width: 32, height: 32}} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    width: '100%',
    height: 120,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconMargin: {
    paddingTop: 20,
  },
});
