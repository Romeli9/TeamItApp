import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const MessengerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White100,
  },
  centerText: {
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messageImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingHorizontal: 10,
  },
  previewImageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 4,
  },
});
