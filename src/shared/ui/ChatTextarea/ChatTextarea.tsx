import React from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';

import {TImages} from 'entities/chat';
import {AddImgIcon, SendIcon} from 'shared/icons';
import {Colors, IconStyles} from 'shared/libs/helpers';

import {ChatTextareaStyles as styles} from './ChatTextarea.styles';

type ChatTextareaProps = {
  message: string;
  setMessage: (text: string) => void;
  onAttachFile?: () => void;
  onSendMessage?: () => void;
};

export const ChatTextarea = ({
  message,
  setMessage,
  onAttachFile,
  onSendMessage,
}: ChatTextareaProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onAttachFile}>
        <AddImgIcon color={Colors.Gray500} size={IconStyles.medium.width} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={'Введите сообщение'}
          placeholderTextColor={Colors.Gray500}
          multiline
          value={message}
          onChangeText={setMessage}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={onSendMessage}>
        <SendIcon color={Colors.Gray500} size={IconStyles.medium.width} />
      </TouchableOpacity>
    </View>
  );
};
