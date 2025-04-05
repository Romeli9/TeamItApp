import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const MessageStyles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    marginTop: 'auto',
  },
  messageContentWrapper: {
    maxWidth: '80%',
  },
  userName: {
    fontSize: 12,
    color: Colors.Black100,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  bubbleLeft: {
    backgroundColor: Colors.Gray100,
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: Colors.Pink100,
    borderBottomRightRadius: 4,
  },
  pressedEffect: {
    opacity: 0.8,
  },
  messageText: {
    fontSize: 16,
    color: Colors.Black100,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: Colors.Gray400,
    marginRight: 4,
  },
  statusIcon: {
    marginLeft: 4,
  },
  contentMessage: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
});
