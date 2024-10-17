import {Chat, HeaderMessenger} from 'components';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const Messenger = ({navigation}: any) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <HeaderMessenger />
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <Chat />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Messenger;
