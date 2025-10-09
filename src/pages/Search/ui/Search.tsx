import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View, ScrollView, TextInput} from 'react-native';

import {FIREBASE_DB} from 'app/FireBaseConfig';
import Checkbox from 'expo-checkbox';
import {collection, getDocs, query, where, orderBy, limit} from 'firebase/firestore';
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
  toggleProjectType,
} from 'redux/slices/filterSlice';
import {setOtherProjects} from 'redux/slices/projectsSlice';
import {RootState} from 'redux/store';
import {categoriesMock} from 'shared/assets/consts/Categories';
import {requiredMock} from 'shared/assets/consts/Required';
import {projectTypes} from 'shared/assets/consts/ProjectTypes';

import {SearchStyles as styles} from './Search.styles';

export const Search: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    categoryes,
    requireds,
    projects,
    projectTypes: selectedProjectTypes,
    searchSkills,
    sortBy
  } = useSelector((state: RootState) => state.filter);

  const {allOtherProjects} = useSelector((state: RootState) => state.projects);
  const {userName, userSkills} = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();
  const [skillInput, setSkillInput] = useState('');

  // Обработчики для фильтров
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
    dispatch(toggleProjectType(type));
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

  // Загрузка проектов с улучшенной фильтрацией
  const fetchProjects = async () => {
    try {
      const projectsRef = collection(FIREBASE_DB, 'projects');
      let projectsQuery = query(projectsRef, where('creator', '!=', userName));
      
      // Добавляем сортировку по активности (последние обновленные)
      projectsQuery = query(projectsQuery, orderBy('updatedAt', 'desc'), limit(50));
      
      const querySnapshot = await getDocs(projectsQuery);
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
          projectType: data.projectType || 'Другое', // Добавляем тип проекта
          members: data.members || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          rating: data.rating || 0,
          responsesCount: data.responsesCount || 0,
        };
      });

      dispatch(setStateProjects(projectsData));
      dispatch(setOtherProjects(projectsData));
    } catch (error) {
      console.error('Error fetching projects: ', error);
    }
  };

  // Умная фильтрация с учетом всех критериев
  const applySmartFiltering = () => {
    let filtered = [...projects];

    // Фильтрация по категориям
    if (categoryes.length > 0) {
      filtered = filtered.filter(project =>
        project.categories.some((category: string) => categoryes.includes(category))
      );
    }

    // Фильтрация по ролям
    if (requireds.length > 0) {
      filtered = filtered.filter(project =>
        project.required.some((require: string) => requireds.includes(require))
      );
    }

    // Фильтрация по типам проектов
    if (selectedProjectTypes.length > 0) {
      filtered = filtered.filter(project =>
        selectedProjectTypes.includes(project.projectType)
      );
    }

    // Фильтрация по навыкам (автоподбор)
    if (searchSkills.length > 0) {
      filtered = filtered.filter(project => {
        const projectSkills = [...(project.required || []), ...(project.categories || [])];
        return searchSkills.some(skill => 
          projectSkills.some((projectSkill: string) => 
            projectSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    // Сортировка
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.responsesCount || 0) - (a.responsesCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'relevance':
      default:
        // Сортировка по релевантности (совпадение навыков + активность)
        filtered.sort((a, b) => {
          const aMatchScore = calculateMatchScore(a);
          const bMatchScore = calculateMatchScore(b);
          return bMatchScore - aMatchScore;
        });
        break;
    }

    dispatch(setOtherProjects(filtered));
  };

  // Расчет релевантности проекта
  const calculateMatchScore = (project: any) => {
    let score = 0;
    
    // Совпадение навыков
    if (searchSkills.length > 0) {
      const projectSkills = [...(project.required || []), ...(project.categories || [])];
      const matches = searchSkills.filter(skill =>
        projectSkills.some((projectSkill: string) =>
          projectSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      score += (matches.length / searchSkills.length) * 50;
    }

    // Активность проекта (недавно обновленные выше)
    if (project.updatedAt) {
      const daysSinceUpdate = (Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 3600 * 24);
      score += Math.max(0, 30 - daysSinceUpdate);
    }

    // Рейтинг автора
    score += (project.rating || 0) * 2;

    return score;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applySmartFiltering();
  }, [categoryes, requireds, selectedProjectTypes, searchSkills, sortBy, projects]);

  return (
    <SafeAreaProvider>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <ScrollView style={styles.scrollContainer}>
          
          {/* Блок автоподбора навыков */}
          <View style={styles.skillsContainer}>
            <Text style={styles.sectionTitle}>Навыки для поиска</Text>
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
              <Button title="Очистить навыки" onPress={() => dispatch(setSearchSkills([]))} />
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
            <Text style={styles.sectionTitle}>Сортировка</Text>
            <View style={styles.sortButtons}>
              {[
                {value: 'relevance', label: 'Релевантность'},
                {value: 'date', label: 'По дате'},
                {value: 'popularity', label: 'Популярность'},
                {value: 'rating', label: 'Рейтинг'}
              ].map(sortOption => (
                <TouchableOpacity
                  key={sortOption.value}
                  style={[
                    styles.sortButton,
                    sortBy === sortOption.value && styles.sortButtonActive
                  ]}
                  onPress={() => dispatch(setSortBy(sortOption.value))}
                >
                  <Text style={[
                    styles.sortButtonText,
                    sortBy === sortOption.value && styles.sortButtonTextActive
                  ]}>
                    {sortOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.boxesContainer}>
            
            {/* Категории */}
            <View style={styles.filterBox}>
              <Text style={styles.sectionTitle}>Категории</Text>
              {categoriesMock.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleCategoryChange(category)}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={categoryes.includes(category)}
                    onValueChange={() => handleCategoryChange(category)}
                    color={categoryes.includes(category) ? '#4630EB' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Роли */}
            <View style={styles.filterBox}>
              <Text style={styles.sectionTitle}>Роли</Text>
              {requiredMock.map((requireded, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleRequireChange(requireded)}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={requireds.includes(requireded)}
                    onValueChange={() => handleRequireChange(requireded)}
                    color={requireds.includes(requireded) ? '#4630EB' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{requireded}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Типы проектов */}
            <View style={styles.filterBox}>
              <Text style={styles.sectionTitle}>Тип проекта</Text>
              {projectTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleProjectTypeChange(type.value)}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={selectedProjectTypes.includes(type.value)}
                    onValueChange={() => handleProjectTypeChange(type.value)}
                    color={selectedProjectTypes.includes(type.value) ? '#4630EB' : undefined}
                  />
                  <Text style={styles.checkboxLabel}>{type.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>

          <View style={styles.actionButtons}>
            <Button title="Сбросить фильтры" onPress={() => dispatch(resetAllFilters())} />
            <Button title="Применить поиск" onPress={() => navigation.goBack()} />
          </View>

        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};