import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';

import {ChatItemStyles as styles} from './ChatItem.styles';

type ChatItemProps = {
  chatName: string;
  onPress: () => void;
};

export const ChatItem = ({chatName, onPress}: ChatItemProps) => {
  const {userName, avatar} = useSelector((state: RootState) => state.user);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.image} source={{uri: avatar}} />
      </View>

      <View style={styles.infoBlock}>
        <View style={styles.header}>
          <Text style={styles.chatName}>{chatName}</Text>
          <Text style={styles.timestamp}>19:30</Text>
        </View>
        <View style={styles.messageBlock}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.messageText}>
            Лысый ахуел? ты когда доделаешь ааааааааааааааааааааааааааа?
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
