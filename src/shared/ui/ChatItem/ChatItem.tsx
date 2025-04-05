import React, {memo, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';
import {formatMessageTime} from 'shared/libs';

import {ChatItemStyles as styles} from './ChatItem.styles';

type ChatItemProps = {
  lastMessage: string;
  time: number;
  group: boolean;
  participants: string[];
  image?: string;
  name?: string;
  lastMessageAuthorId?: string;
  onPress: (chatName: string) => void;
};

export const ChatItem = memo(
  ({
    lastMessage,
    onPress,
    time,
    group,
    participants,
    image,
    name,
    lastMessageAuthorId,
  }: ChatItemProps) => {
    const {userId} = useSelector((state: RootState) => state.user);

    const [userNameLast, setUserNameLast] = useState('');

    const [chatData, setChatData] = useState({
      name: '',
      lastMessage,
      time: '',
      imageUri: '',
    });

    useEffect(() => {
      lastMessageAuthorId &&
        getUserById(lastMessageAuthorId).then(res => {
          setUserNameLast(res.username);
        });
    }, [lastMessageAuthorId]);

    useEffect(() => {
      const formData = async () => {
        const formattedTime = formatMessageTime(time);
        switch (group) {
          case true: {
            if (name) {
              let imageUri = image ?? '';
              setChatData({name, time: formattedTime, imageUri, lastMessage});
              break;
            }
          }

          case false: {
            let userIdParticipant = participants.filter(
              item => item !== userId,
            )[0];
            let userInfo = await getUserById(userIdParticipant);
            let imageUri = userInfo.avatar;
            let name = userInfo.username;
            setChatData({name, time: formattedTime, imageUri, lastMessage});
            break;
          }
        }
      };

      formData();
    }, [lastMessage, time]);

    return (
      <TouchableOpacity
        onPress={() => onPress(chatData.name)}
        style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image style={styles.image} source={{uri: chatData.imageUri}} />
        </View>

        <View style={styles.infoBlock}>
          <View style={styles.header}>
            <Text style={styles.chatName}>{chatData.name}</Text>
            <Text style={styles.timestamp}>{chatData.time}</Text>
          </View>
          <View style={styles.messageBlock}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.messageText}>
              {`${userNameLast}${userNameLast ? ':' : ''} ${
                chatData.lastMessage
              }`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);
