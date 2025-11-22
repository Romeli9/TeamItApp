import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import ReviewModal from 'components/ReviewModal';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {selectAchievements} from 'redux/slices/achievementsSlice';
import {RootState} from 'redux/store';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

import {AchievementsStyles as styles} from './Achievements.style';

export const Achievements = () => {
  const navigation = useAppNavigation();
  const badges = useSelector(selectAchievements);

  // Фильтруем ачивки
  const completed = badges.filter(b => b.progress >= 100);
  const inProgress = badges.filter(b => b.progress > 0 && b.progress < 100);
  const notStarted = badges.filter(b => b.progress === 0 && !b.secret);

  // Скрытые ачивки (секретные)
  const secret = badges.filter(b => b.secret && b.progress < 100);

  const renderBadge = (item: any) => (
    <View style={styles.item}>
      <Text style={styles.badgeName}>
        {item.secret && item.progress < 100 ? '???' : item.name}
      </Text>
      <Text style={styles.badgeDescription}>
        {item.secret && item.progress < 100 ? '???' : item.description}
      </Text>
      {item.progress > 0 && (
        <Text style={styles.badgeProgress}>
          Прогресс: {item.secret ? '???' : item.progress}%
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Достижения</Text>

        <FlatList
          data={[...completed, ...inProgress, ...notStarted, ...secret]}
          keyExtractor={item => item.id}
          renderItem={({item}) => renderBadge(item)}
        />

        <Button title="Назад" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};
