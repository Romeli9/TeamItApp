import {Spinner} from '@ui-kitten/components';
import React, {memo} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import {CheckIcon, DoubleCheckIcon} from 'shared/icons';
import {formatMessageTime} from 'shared/libs';
import {Colors, IconStyles} from 'shared/libs/helpers';

import {MessageStyles as styles} from './Message.styles';

type MessageProps = {
  message: string;
  status: 'sending' | 'sent' | 'read';
  onLongPress?: (event: GestureResponderEvent) => void;
  isCurrentUser?: boolean;
  avatar?: string;
  timestamp: any;
  userName?: string;
};

export const Message = memo(
  ({
    message,
    status,
    onLongPress,
    isCurrentUser,
    avatar,
    timestamp,
    userName,
  }: MessageProps) => {
    const date = new Date(timestamp);
    const formData = date.getHours() + ':' + date.getMinutes();
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
            ? styles.currentUserContainer
            : styles.otherUserContainer,
        ]}>
        {!isCurrentUser &&
          (avatar ? (
            <Image source={{uri: avatar}} style={styles.avatar} />
          ) : (
            <ActivityIndicator
              style={styles.avatar}
              size="large"
              color="#BE9DE8"
            />
          ))}

        <View style={styles.messageContentWrapper}>
          <Pressable
            style={({pressed}) => [
              styles.bubble,
              isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
              pressed && styles.pressedEffect,
            ]}
            onLongPress={onLongPress}>
            <View>
              {!isCurrentUser && userName && (
                <Text style={styles.userName}>{userName}</Text>
              )}
            </View>
            <View style={styles.contentMessage}>
              <Text style={styles.messageText}>{message}</Text>

              <View style={styles.messageMeta}>
                <Text style={styles.timeText}>{formData}</Text>
                {isCurrentUser && (
                  <View style={styles.statusIcon}>{renderIcon()}</View>
                )}
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    );
  },
);
