import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {getUserById} from 'services/getUserById';

import {ChatItemStyles as styles} from './ChatItem.styles';

type ChatItemProps = {
  lastMessage: string;
  time: number;
  group: boolean;
  participants: string[];
  image: string | undefined;
  onPress: (chatName: string) => void;
};

export const ChatItem = ({
  lastMessage,
  onPress,
  time,
  group,
  participants,
  image,
}: ChatItemProps) => {
  const {userId} = useSelector((state: RootState) => state.user);

  const [chatData, setChatData] = useState({
    name: '',
    lastMessage,
    time: '',
    imageUri: '',
  });

  useEffect(() => {
    const formData = async () => {
      const date = new Date(time * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = hours + ':' + minutes;

      switch (group) {
        case true: {
          const userInfoFirst = await getUserById(participants[0]);
          const userInfoSecond = await getUserById(participants[1]);

          let name = userInfoFirst.username + ', ' + userInfoSecond.username;

          if (participants.length > 2) {
            name += ' и другие';
          }
          let imageUri = image ?? '';

          setChatData({name, time: formattedTime, imageUri, lastMessage});
          break;
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

        default:
          break;
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
            {chatData.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
