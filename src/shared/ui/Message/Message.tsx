import {Spinner} from '@ui-kitten/components';
import React, {memo} from 'react';
import {GestureResponderEvent, Pressable, Text, View} from 'react-native';

import {CheckIcon, DoubleCheckIcon} from 'shared/icons';
import {Colors, IconStyles} from 'shared/libs/helpers';

import {MessageStyles as styles} from './Message.styles';

type MessageProps = {
  isRead?: boolean;
  message: string;
  status: 'sending' | 'sent' | 'read';
  onLongPress?: (event: GestureResponderEvent) => void;
  isSending?: boolean;
  isCurrentUser?: boolean;
};

export const Message = memo(
  ({isRead, message, status, onLongPress, isCurrentUser}: MessageProps) => {
    const renderIcon = () => {
      if (status === 'sending') {
        return (
          <Spinner
            style={{
              width: IconStyles.small.width,
              height: IconStyles.small.height,
            }}
          />
        );
      }
      if (status === 'read') {
        return (
          <DoubleCheckIcon
            fill={IconStyles.small.changeColor(Colors.Blue200).color}
            width={IconStyles.small.width}
            height={IconStyles.small.height}
          />
        );
      }
      return (
        <CheckIcon
          fill={IconStyles.small.changeColor(Colors.Blue200).color}
          width={IconStyles.small.width}
          height={IconStyles.small.height}
        />
      );
    };

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.messageContainerRight
            : styles.messageContainerLeft,
        ]}>
        <Pressable
          style={({pressed}) => [
            styles.bubble,
            isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
            pressed &&
              (isCurrentUser
                ? styles.backGroundChangeRight
                : styles.backGroundChangeLeft),
          ]}
          onLongPress={onLongPress}>
          <View style={styles.messageContent}>
            <Text
              style={[
                styles.messageText,
                isCurrentUser
                  ? styles.messageTextRight
                  : styles.messageTextLeft,
              ]}>
              {message}
            </Text>
          </View>
          {isCurrentUser && (
            <View style={styles.statusIcon}>{renderIcon()}</View>
          )}
        </Pressable>
      </View>
    );
  },
);
