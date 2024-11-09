import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {FIREBASE_AUTH, FIREBASE_DB} from 'app/FireBaseConfig';
import Checkbox from 'expo-checkbox';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCategory,
  setRequired,
  setStateProjects,
} from 'redux/slices/filterSlice';
import {setOtherProjects} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {categories} from 'shared/assets/consts/Categories';
import {required} from 'shared/assets/consts/Required';

import {SearchStyles as styles} from './Search.styles';

export const Search: React.FC = () => {
  const navigation = useNavigation();

  const {categoryes, requireds, projects} = useSelector(
    (state: RootState) => state.filter,
  );

  const {userName} = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const handleCategoryChange = (category: string) => {
    if (categoryes.includes(category)) {
      // Если уже выбран, убираем из списка
      dispatch(setCategory(categoryes.filter(item => item !== category)));
    } else {
      // Если не выбран, добавляем в список
      dispatch(setCategory([...categoryes, category]));
    }
  };

  const handleRequireChange = (require: string) => {
    if (requireds.includes(require)) {
      // Если уже выбран, убираем из списка
      dispatch(setRequired(requireds.filter(item => item !== require)));
    } else {
      // Если не выбран, добавляем в список
      dispatch(setRequired([...requireds, require]));
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(FIREBASE_DB, 'projects');
      const querySnapshot = await getDocs(
        query(projectsRef, where('creator', '!=', userName)),
      );
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        creator: doc.data().creator,
        creatorId: doc.data().creatorId,
        description: doc.data().description,
        name: doc.data().name,
        photo: doc.data().photo,
        required: doc.data().required,
        categories: doc.data().categories,
        members: doc.data().members,
      }));

      dispatch(setStateProjects(projectsData));
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (categoryes.length > 0 || requireds.length > 0) {
      let filtered = projects.filter(
        project =>
          project.categories.some((category: string) =>
            categoryes.includes(category),
          ) ||
          project.required.some((require: string) =>
            requireds.includes(require),
          ),
      );
      dispatch(setOtherProjects(filtered));
    } else {
      dispatch(setOtherProjects(projects));
    }
  }, [categoryes, requireds]);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.boxesContainer}>
          <View style={styles.containerboxed1}>
            <Text style={styles.textStyle1}>Категории</Text>
            {categories.map(category => (
              <TouchableOpacity
                key={category.key}
                style={styles.checkboxContainer}
                onPress={() => handleCategoryChange(category.value)}>
                <Checkbox
                  style={styles.checkbox}
                  value={categoryes.includes(category.value)}
                  onValueChange={() => handleCategoryChange(category.value)}
                  color={
                    categoryes.includes(category.value) ? '#4630EB' : undefined
                  }
                />
                <Text style={styles.textStyle2}>{category.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.containerboxed2}>
            <Text style={styles.textStyle1}>Роли</Text>
            {required.map(requireded => (
              <TouchableOpacity
                key={requireded.key}
                style={styles.checkboxContainer}
                onPress={() => handleRequireChange(requireded.value)}>
                <Checkbox
                  style={styles.checkbox}
                  value={requireds.includes(requireded.value)}
                  onValueChange={() => handleRequireChange(requireded.value)}
                  color={
                    requireds.includes(requireded.value) ? '#4630EB' : undefined
                  }
                />
                <Text style={styles.textStyle2}>{requireded.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button title="Искать" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaProvider>
  );
};
