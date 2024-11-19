import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const MessageStyles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 100,
  },
  bubbleLeft: {
    backgroundColor: Colors.Gray200,
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: Colors.Green100Opacity30,
    borderTopRightRadius: 0,
  },
  backGroundChangeLeft: {
    backgroundColor: Colors.Gray100,
  },
  backGroundChangeRight: {
    backgroundColor: Colors.Green100,
  },
  messageContainerLeft: {
    justifyContent: 'flex-start',
  },
  messageContainerRight: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  messageText: {
    fontSize: 16,
  },
  messageTextLeft: {
    color: Colors.Black100,
  },
  messageTextRight: {
    color: Colors.Black100,
  },
  inlineStatusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    marginRight: -10,
    marginBottom: -5,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 10,
    marginTop: 5,
  },
  reactionsAndStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  reaction: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.Blue200,
  },
  statusIcon: {
    // marginLeft: 'auto',
    // marginTop: 10,
    // marginRight: -7,
    // marginBottom: -5,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  spaceBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  messageImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
});
