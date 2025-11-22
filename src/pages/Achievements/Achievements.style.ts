import {StyleSheet} from 'react-native';

export const AchievementsStyles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  container: {flex: 1, padding: 16},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 16},
  sectionTitle: {fontSize: 20, fontWeight: '600', marginVertical: 8},
  item: {padding: 12, borderBottomWidth: 1, borderColor: '#ccc'},
  badgeName: {fontSize: 16, fontWeight: '500'},
  badgeType: {fontSize: 14, color: '#555'},
  badgeProgress: {fontSize: 14, color: '#007AFF'},
  badgeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
