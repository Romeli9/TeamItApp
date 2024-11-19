import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ChatListStyles = StyleSheet.create({
  ChatListContainer: {
    flex: 1,
    backgroundColor: Colors.White100,
  },
  container: {
    paddingTop: 20,
    // alignItems: 'center',
  },
  listContent: {
    paddingBottom: 10,
  },
  chats: {},
});
