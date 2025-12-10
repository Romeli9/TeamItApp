import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View, ScrollView, TextInput} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
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
  setProjectTypes,
  setSearchSkills,
  setSortBy,
  resetAllFilters,
  addSearchSkill,
  removeSearchSkill,
} from 'redux/slices/filterSlice';
import {setOtherProjects} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {categoriesMock} from 'shared/assets/consts/Categories';
import {requiredMock} from 'shared/assets/consts/Required';
import {projectTypesMock} from 'shared/assets/consts/ProjectTypes';

import {SearchStyles as styles} from './Search.styles';

export const Search: React.FC = () => {
  const navigation = useNavigation();

  const {categoryes, requireds, projects, projectTypes: selectedProjectTypes, searchSkills, sortBy} = useSelector(
    (state: RootState) => state.filter,
  );

  const {allOtherProjects} = useSelector((state: RootState) => state.projects);

  const {userName, userSkills} = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const [skillInput, setSkillInput] = useState('');

  const handleCategoryChange = (category: string) => {
    if (categoryes.includes(category)) {
      dispatch(setCategory(categoryes.filter(item => item !== category)));
    } else {
      dispatch(setCategory([...categoryes, category]));
    }
  };

  const handleRequireChange = (require: string) => {
    if (requireds.includes(require)) {
      dispatch(setRequired(requireds.filter(item => item !== require)));
    } else {
      dispatch(setRequired([...requireds, require]));
    }
  };

  const handleProjectTypeChange = (type: string) => {
    if (selectedProjectTypes.includes(type)) {
      dispatch(setProjectTypes(selectedProjectTypes.filter(item => item !== type)));
    } else {
      dispatch(setProjectTypes([...selectedProjectTypes, type]));
    }
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !searchSkills.includes(skillInput.trim())) {
      dispatch(addSearchSkill(skillInput.trim()));
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skill: string) => {
    dispatch(removeSearchSkill(skill));
  };

  const loadSkillsFromProfile = () => {
    if (userSkills && userSkills.length > 0) {
      dispatch(setSearchSkills([...userSkills]));
    }
  };

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(FIREBASE_DB, 'projects');
      const querySnapshot = await getDocs(
        query(projectsRef, where('creator', '!=', userName)),
      );
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          creator: data.creator,
          creatorId: data.creatorId,
          description: data.description,
          name: data.name,
          photo: data.photo,
          required: data.required || [],
          categories: data.categories || [],
          projectType: data.projectType || 'Другое',
          members: data.members || [],
        };
      });

      dispatch(setStateProjects(projectsData));
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (categoryes.length > 0 || requireds.length > 0 || selectedProjectTypes.length > 0 || searchSkills.length > 0) {
      let filtered = projects.filter(project => {
        const categoryMatch = categoryes.length === 0 || 
          project.categories.some((category: string) => categoryes.includes(category));
        
        const requiredMatch = requireds.length === 0 ||
          project.required.some((require: string) => requireds.includes(require));
        
        const projectTypeMatch = selectedProjectTypes.length === 0 ||
          selectedProjectTypes.includes(project.projectType);
        
        const skillsMatch = searchSkills.length === 0 || 
          searchSkills.some(skill => {
            const projectSkills = [...(project.required || []), ...(project.categories || [])];
            return projectSkills.some((projectSkill: string) => 
              projectSkill.toLowerCase().includes(skill.toLowerCase())
            );
          });

        return categoryMatch && requiredMatch && projectTypeMatch && skillsMatch;
      });

      // Простая сортировка по умолчанию
      if (sortBy === 'date') {
        // Можно добавить сортировку по дате, если есть поле createdAt
      }

      dispatch(setOtherProjects(filtered));
    } else {
      dispatch(setOtherProjects(allOtherProjects));
    }
  }, [categoryes, requireds, selectedProjectTypes, searchSkills, sortBy]);

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <ScrollView style={styles.scrollContainer}>
          
          {/* Блок навыков */}
          <View style={styles.skillsContainer}>
            <Text style={styles.textStyle1}>Навыки для поиска</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={styles.skillInput}
                value={skillInput}
                onChangeText={setSkillInput}
                placeholder="Добавьте навык..."
                onSubmitEditing={handleSkillAdd}
              />
              <Button title="Добавить" onPress={handleSkillAdd} />
            </View>
            
            <View style={styles.skillsButtons}>
              <Button title="Загрузить из профиля" onPress={loadSkillsFromProfile} />
              <Button title="Очистить" onPress={() => dispatch(setSearchSkills([]))} />
            </View>

            <View style={styles.skillsList}>
              {searchSkills.map((skill, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.skillTag}
                  onPress={() => handleSkillRemove(skill)}
                >
                  <Text style={styles.skillTagText}>{skill} ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Сортировка */}
          <View style={styles.sortContainer}>
            <Text style={styles.textStyle1}>Сортировка</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'relevance' && styles.sortButtonActive]}
                onPress={() => dispatch(setSortBy('relevance'))}
              >
                <Text style={[styles.sortButtonText, sortBy === 'relevance' && styles.sortButtonTextActive]}>
                  Релевантность
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
                onPress={() => dispatch(setSortBy('date'))}
              >
                <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
                  По дате
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'popularity' && styles.sortButtonActive]}
                onPress={() => dispatch(setSortBy('popularity'))}
              >
                <Text style={[styles.sortButtonText, sortBy === 'popularity' && styles.sortButtonTextActive]}>
                  Популярность
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.boxesContainer}>
            <View style={styles.containerboxed1}>
              <Text style={styles.textStyle1}>Категории</Text>
              {categoriesMock.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleCategoryChange(category)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={categoryes.includes(category)}
                    onValueChange={() => handleCategoryChange(category)}
                    color={
                      categoryes.includes(category) ? '#4630EB' : undefined
                    }
                  />
                  <Text style={styles.textStyle2}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.containerboxed2}>
              <Text style={styles.textStyle1}>Роли</Text>
              {requiredMock.map((requireded, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleRequireChange(requireded)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={requireds.includes(requireded)}
                    onValueChange={() => handleRequireChange(requireded)}
                    color={
                      requireds.includes(requireded) ? '#4630EB' : undefined
                    }
                  />
                  <Text style={styles.textStyle2}>{requireded}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Новый блок - Типы проектов */}
            <View style={styles.containerboxed3}>
              <Text style={styles.textStyle1}>Тип проекта</Text>
              {projectTypesMock.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleProjectTypeChange(type)}>
                  <Checkbox
                    style={styles.checkbox}
                    value={selectedProjectTypes.includes(type)}
                    onValueChange={() => handleProjectTypeChange(type)}
                    color={
                      selectedProjectTypes.includes(type) ? '#4630EB' : undefined
                    }
                  />
                  <Text style={styles.textStyle2}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button title="Сбросить фильтры" onPress={() => dispatch(resetAllFilters())} />
            <Button title="Искать" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};