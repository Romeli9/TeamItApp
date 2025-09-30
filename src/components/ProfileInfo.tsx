import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {getFileUrl} from 'api';
import {Screens} from 'app/navigation/navigationEnums';
import {useSelector} from 'react-redux';
import {ProjectType} from 'redux/slices/projectsSlice';
import 'redux/slices/userSlice';
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

  useSelector((state: RootState) => state.projects);

  const renderProjectItem = ({item}: {item: ProjectType}) => (
    <TouchableOpacity onPress={() => OpenProject(item.id)}>
      <Image source={{uri: item.photo}} style={styles.projectImage} />
      <Text style={styles.projectName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Navigate to the project screen with the given project ID.
   * @param {string} projectID - The ID of the project to navigate to.
   */
  const OpenProject = (projectID: string) => {
    navigate(Screens.PROJECT, {projectId: projectID});
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.text_project}>Проекты:</Text>

      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item: ProjectType) => item.id}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  profileInfo: {
    display: 'flex',
    width: '100%',
    gap: 16,
  },
  text: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  projectImage: {
    width: 175,
    height: 250,
    borderRadius: 20,
  },
  projectName: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 175, 
  },

  text_project: {
    paddingTop: 20,
    paddingLeft: 16,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '500',
  },
});
