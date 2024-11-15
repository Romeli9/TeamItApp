import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';

export const Chat = () => {
  const {userName, avatar} = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.image} source={{uri: avatar}} />
      </View>

      <View style={styles.infoBlock}>
        <View style={styles.header}>
          <Text style={styles.chatName}>{userName}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 326,
    height: 77,
    borderBottomWidth: 2,
    borderBottomColor: '#E4E4E4',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoBlock: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000000',
  },
  timestamp: {
    fontSize: 14,
    color: '#888888',
  },
  messageBlock: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#000000',
  },
  messageStatus: {
    backgroundColor: '#D8A6FF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  messageStatusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
