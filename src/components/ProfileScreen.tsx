// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Screens } from 'app/navigation/navigationEnums';
import { RootStackParamsList } from 'app/navigation/navigationTypes';

const PRIMARY_COLOR = '#BE9DE8';

const ROLES = [
  { name: 'Исполнитель', desc: 'Дисциплинирован, практичен, надёжен.' },
  { name: 'Председатель', desc: 'Спокоен, уверенно координирует команду.' },
  { name: 'Формирователь', desc: 'Целеустремлён, энергичен, нетерпим к бездействию.' },
  { name: 'Мыслитель', desc: 'Генерирует идеи, глубоко анализирует проблемы.' },
  { name: 'Разведчик', desc: 'Общителен, ищет новые возможности вне команды.' },
  { name: 'Оценивающий', desc: 'Критически мыслит, взвешивает все "за" и "против".' },
  { name: 'Коллективист', desc: 'Сглаживает конфликты, поддерживает атмосферу.' },
  { name: 'Доводящий до конца', desc: 'Внимателен к деталям, завершает задачи.' },
];

// Тип для параметров экрана
type ProfileRouteProp = RouteProp<RootStackParamsList, Screens.PROFILE>;

export const ProfileScreen = () => {
  const route = useRoute<ProfileRouteProp>();
  const [belbinResults, setBelbinResults] = useState<number[] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (route.params?.belbinResults) {
      setBelbinResults(route.params.belbinResults);
    }
  }, [route.params]);

  if (!belbinResults) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ваш профиль</Text>
        <Text>Пройдите тест Белбина, чтобы увидеть свои командные роли.</Text>
      </ScrollView>
    );
  }

  // Найдём основную роль
  const maxScore = Math.max(...belbinResults);
  const mainRoleIndex = belbinResults.indexOf(maxScore);
  const mainRole = ROLES[mainRoleIndex];

  // Второстепенные роли (все, кроме основной)
  const secondaryRoles = ROLES.filter((_, i) => i !== mainRoleIndex && belbinResults[i] > 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Командная роль (тест Белбина)</Text>

      {/* Основная роль */}
      <View style={styles.mainRoleCard}>
        <Text style={styles.mainRoleTitle}>{mainRole.name}</Text>
        <Text style={styles.mainRoleDesc}>{mainRole.desc}</Text>
      </View>

      {/* Второстепенные роли — бейджи */}
      <View style={styles.badgesContainer}>
        {secondaryRoles.map((role, i) => (
          <View key={i} style={styles.badge}>
            <Text style={styles.badgeText}>{role.name}</Text>
          </View>
        ))}
      </View>

      {/* Кнопка "Подробнее" */}
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {showDetails ? 'Скрыть детали' : 'Показать все роли'}
        </Text>
      </TouchableOpacity>

      {/* Детали — все роли с баллами */}
      {showDetails && (
        <View style={styles.details}>
          {ROLES.map((role, i) => (
            <View key={i} style={styles.roleRow}>
              <Text style={styles.roleName}>{role.name}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { width: `${Math.min(belbinResults[i], 30) * 3}%`, backgroundColor: PRIMARY_COLOR },
                  ]}
                />
                <Text style={styles.score}>{belbinResults[i]}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Кнопка повторного прохождения */}
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => {
          setBelbinResults(null);
          // navigate(Screens.BELBIN_TEST);
        }}>
        <Text style={styles.retakeText}>Повторно пройти тест</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fafbff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainRoleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainRoleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  mainRoleDesc: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: PRIMARY_COLOR + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  toggleText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    width: '100%',
    marginBottom: 20,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleName: {
    width: 160,
    fontSize: 15,
    color: '#333',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: PRIMARY_COLOR,
  },
  score: {
    fontSize: 14,
    color: '#666',
    minWidth: 20,
  },
  retakeButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  retakeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});