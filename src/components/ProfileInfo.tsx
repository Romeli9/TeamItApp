import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Animated, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FireBaseConfig';

function ProfileInfo() {
  const {telegramm, skills, experience, aboutMe} = useSelector(
    (state: RootState) => state.user,
  );

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [projects, setProjects] = useState([]);
  const animatedHeight = useState(new Animated.Value(0))[0];
  
  // Состояние для хранения изображения кнопки
  const [buttonImage, setButtonImage] = useState(require('../assets/profile/down.png'));
  const [subscribed, setSubscribed] = useState(false);

  const toggleMoreInfo = () => {
    setShowMoreInfo(prevState => !prevState);
    Animated.timing(animatedHeight, {
      toValue: showMoreInfo ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Изменяем изображение кнопки
    setButtonImage(showMoreInfo ? require('../assets/profile/down.png') : require('../assets/profile/up.png'));
  };
  
  const additionalInfoHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Увеличиваем максимальную высоту
  });

  const handleSubscribe = () => {
    setSubscribed(true); // Изменяем состояние подписки
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Обо мне: {aboutMe}</Text>
      
      <View style={styles.additionalInfoContainer}>
        <Animated.View style={{...styles.additionalInfo, maxHeight: additionalInfoHeight}}>
          {showMoreInfo && (
            <>
              <Text style={styles.text}>Опыт: {experience}</Text>
              <Text style={styles.text}>Навыки: {skills}</Text>
              <Text style={styles.text}>Телеграмм: {telegramm}</Text>
            </>
          )}
        </Animated.View>
        <Text style={styles.text_project}>Проекты:</Text>

      </View>
      
      <TouchableOpacity
          style={styles.down_button}
          onPress={toggleMoreInfo}>
          <Image
            source={buttonImage}
            style={{width: 12, height: 12}}
          />
      </TouchableOpacity>
    </View>
  );
}

export default ProfileInfo;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  down_button: {
    position: 'absolute',
    top: 7,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
    width: 250, 
  },
  additionalInfoContainer: {
    overflow: 'hidden', 
    width: 250, 
    height: 175,
  },
  additionalInfo: {
    width: '100%', 
  },
  text_project:{
    fontSize: 20,
    fontWeight: '500',
  },
});
