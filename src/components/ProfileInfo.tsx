import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';

function ProfileInfo() {
  const {telegramm, skills, experience, aboutMe} = useSelector(
    (state: RootState) => state.user,
  );
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Обо мне: {aboutMe}</Text>
      <Text style={styles.text}>Опыт: {experience}</Text>
      <Text style={styles.text}>Навыки: {skills}</Text>
      <Text style={styles.text}>Телеграмм: {telegramm}</Text>
    </View>
  );
}

export default ProfileInfo;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
});
