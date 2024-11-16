import React, {memo, useState} from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors, IconStyles, TextStyles, emoji} from 'shared/libs/helpers';

import {MessageStyles as styles} from './Message.styles';

type MessageProps = {
  isRead?: boolean;
  message: string;
  onLongPress?: (event: GestureResponderEvent) => void;
  // isSending: boolean;
  hasError?: boolean;
  isCurrentUser: boolean;
};

export const Message = memo(
  ({
    isRead,
    message,
    // isSending,
    hasError,
    onLongPress,
    isCurrentUser,
  }: MessageProps) => {
    // const renderIcon = () => {
    //   if (hasError) {
    //     return (
    //       <AlertIcon
    //         style={{
    //           width: IconStyles.small.width,
    //           height: IconStyles.small.height,
    //         }}
    //         accessible={true}
    //         accessibilityLabel={t('Ошибка отправки сообщения')}
    //       />
    //     );
    //   }
    //   if (isSending)
    //     return (
    //       <Spinner
    //         style={{
    //           width: IconStyles.small.width,
    //           height: IconStyles.small.height,
    //         }}
    //         accessible={true}
    //         accessibilityLabel={t('Сообщение отправляется')}
    //       />
    //     );
    //   else {
    //     if (isRead)
    //       return (
    //         <DoubleCheckIcon
    //           fill={IconStyles.small.changeColor(Colors.Blue200).color}
    //           width={IconStyles.small.width}
    //           height={IconStyles.small.height}
    //           accessible={true}
    //           accessibilityLabel={t('Сообщение прочитано')}
    //         />
    //       );
    //     else
    //       return (
    //         <CheckIcon
    //           fill={IconStyles.small.changeColor(Colors.Blue200).color}
    //           width={IconStyles.small.width}
    //           height={IconStyles.small.height}
    //           accessible={true}
    //           accessibilityLabel={t('Сообщение доставлено')}
    //         />
    //       );
    //   }
    // };

    return (
      <>
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
              {/* {reactions.length === 0 && isCurrentUser && (
                <View style={styles.inlineStatusIcon}>{renderIcon()}</View>
              )} */}
            </View>
            {/* {reactions.length > 0 && (
              <View style={styles.reactionsAndStatusContainer}>
                <View style={styles.reactionsContainer}>
                  {reactions.map((reaction, ix) => {
                    const onPress = () => onSendReaction(reaction.reaction);
                    return (
                      <TouchableOpacity
                        key={ix}
                        onPress={onPress}
                        style={styles.reaction}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`${t('Реакция')} ${
                          emoji[reaction.reaction as keyof typeof emoji]
                        }`}>
                        <Text
                          style={TextStyles.span1.changeColor(Colors.White100)}>
                          {emoji[reaction.reaction as keyof typeof emoji]}{' '}
                          {reaction.count}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {isCurrentUser && (
                  <View style={styles.statusIcon}>{renderIcon()}</View>
                )}
              </View>
            )} */}
          </Pressable>
        </View>
      </>
    );
  },
);
