import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import {BellIcon, SearchIcon} from 'shared/assets/icons/icons';

export const HeaderMessenger = () => {
  return (
    <LinearGradient
      style={styles.container}
      colors={['rgba(114, 47, 181, 0.29)', 'rgba(200, 178, 246, 1)']}>
      <TouchableOpacity>
        <SearchIcon style={{width: 24, height: 24}} />
      </TouchableOpacity>
      <TouchableOpacity>
        <BellIcon style={{width: 24, height: 24}} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    width: '100%',
    height: 106,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
});
