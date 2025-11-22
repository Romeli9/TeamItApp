import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Screens} from 'app/navigation/navigationEnums';
import {useSelector} from 'react-redux';
import {selectAchievements} from 'redux/slices/achievementsSlice';
import {selectAuthorStats} from 'redux/slices/authorStatsSlice';
import {ProjectType} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {useAppNavigation} from 'shared/libs/useAppNavigation';

export interface ProfileInfoProps {
  projects: ProjectType[];
}

export const ProfileInfo = ({projects}: ProfileInfoProps) => {
  const {navigate} = useAppNavigation();

  const {telegramm, HardSkills, SoftSkills, experience, aboutMe} = useSelector(
    (state: RootState) => state.user,
  );

  const {
    avgTotal,
    avgHard,
    avgSoft,
    avgDeadlines,
    avgContribution,
    lastComments,
  } = useSelector((state: RootState) => state.reviewStats);

  // Внутри Profile компонента:
  const authorStats = useSelector(selectAuthorStats);
  const badges = useSelector(selectAchievements);

  const completed = badges.filter(b => b.progress >= 100);

  const renderProjectItem = ({item}: {item: ProjectType}) => (
    <TouchableOpacity
      onPress={() => navigate(Screens.PROJECT, {projectId: item.id})}>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Основная информация */}
      <View style={styles.profileInfo}>
        <Text style={styles.text}>Обо мне: {aboutMe}</Text>
        <Text style={styles.text}>Опыт: {experience}</Text>
        <Text style={styles.text}>
          Hard Skills:{' '}
          {JSON.parse(HardSkills)
            .map((item: {name: string}) => item.name)
            .join(', ')}
        </Text>
        <Text style={styles.text}>
          Soft Skills:{' '}
          {JSON.parse(SoftSkills)
            .map((item: {name: string}) => item.name)
            .join(', ')}
        </Text>
        <Text style={styles.text}>Телеграм: {telegramm}</Text>
      </View>

      {/* ⭐️ Рейтинг */}
      <View style={styles.ratingBlock}>
        <Text style={styles.sectionTitle}>Рейтинг и отзывы</Text>
        {avgTotal === 0 ? (
          <Text>Пока нет отзывов</Text>
        ) : (
          <>
            <Text style={styles.ratingText}>Общий рейтинг: {avgTotal}/5</Text>

            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Проф. навыки</Text>
              <Text>{avgHard}/5</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Командная работа</Text>
              <Text>{avgSoft}/5</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Соблюдение сроков</Text>
              <Text>{avgDeadlines}/5</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>Вклад в проект</Text>
              <Text>{avgContribution}/5</Text>
            </View>

            {lastComments.length > 0 && (
              <View style={{marginTop: 12}}>
                <Text style={styles.subTitle}>Последние отзывы:</Text>
                {lastComments.map((c, i) => (
                  <Text key={i} style={styles.commentText}>
                    “{c}”
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* 🔹 Рейтинг автора */}
      <View style={styles.ratingBlock}>
        <Text style={styles.sectionTitle}>Рейтинг автора</Text>
        <Text>Завершённые проекты: {authorStats.completionRate}%</Text>
        <Text>Средняя оценка участников: {authorStats.avgTeamRating}/5</Text>

        {authorStats.leadershipComments.length > 0 && (
          <View style={{marginTop: 8}}>
            <Text>Отзывы команды о лидерстве:</Text>
            {authorStats.leadershipComments.map((c, i) => (
              <Text key={i} style={styles.commentText}>
                “{c}”
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* 🔹 Бейджи и ачивки */}
      {completed.length > 0 && (
        <View style={styles.ratingBlock}>
          <Text style={styles.sectionTitle}>Бейджи и ачивки</Text>
          <View style={styles.badgesRow}>
            {completed.map(badge => {
              return (
                <View key={badge.id} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* 🔹 Проекты */}
      <Text style={styles.text_project}>Проекты:</Text>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          width: '100%',
          gap: 8,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  profileInfo: {
    gap: 8,
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  ratingBlock: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  ratingLabel: {
    color: '#555',
    fontSize: 15,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  commentText: {
    fontStyle: 'italic',
    color: '#444',
    marginTop: 4,
    marginLeft: 8,
  },
  projectImage: {
    width: 155,
    height: 250,
    borderRadius: 20,
  },
  projectName: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text_project: {
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  authorStats: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  badgesBlock: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginBottom: 24,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#ffd700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
