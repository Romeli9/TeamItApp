import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const ChatTextareaStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderTopColor: Colors.Gray100,
    borderTopWidth: 1,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.Gray050,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  input: {
    fontSize: 16,
    color: Colors.Black200,
    maxHeight: 180,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
