import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ProfileViewStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#999',
    fontSize: 16,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  aboutMe: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#333',
  },
  experience: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  projectsList: {
    paddingHorizontal: 5,
  },
  projectItem: {
    width: 150,
    marginRight: 15,
  },
  projectImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  noProjectsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});
