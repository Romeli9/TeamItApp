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
            <Text>Проф. навыки: {avgHard}/5</Text>
            <Text>Командная работа: {avgSoft}/5</Text>
            <Text>Соблюдение сроков: {avgDeadlines}/5</Text>
            <Text>Вклад в проект: {avgContribution}/5</Text>

            {lastComments.length > 0 && (
              <View style={{marginTop: 10}}>
                <Text style={styles.subTitle}>Последние отзывы:</Text>
                {lastComments.map((c, i) => (
                  <Text key={i} style={{fontStyle: 'italic'}}>
                    “{c}”
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* 🔹 Проекты */}
      <Text style={styles.text_project}>Проекты:</Text>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%'},
  profileInfo: {gap: 8, marginBottom: 16},
  text: {fontSize: 15, color: '#333'},
  ratingBlock: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  ratingText: {fontSize: 16, fontWeight: '600'},
  subTitle: {fontSize: 15, fontWeight: '600', marginTop: 5},
  projectImage: {width: 175, height: 250, borderRadius: 20},
  projectName: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 175,
  },
  text_project: {
    paddingTop: 10,
    paddingLeft: 16,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '500',
  },
});
