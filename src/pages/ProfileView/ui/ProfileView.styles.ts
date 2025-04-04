import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ProfileViewStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#BE9DE8',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  avatarContainer: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: 133,
    height: 133,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },
  avatarPlaceholder: {
    width: 125,
    height: 125,
    borderRadius: 100,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  infoContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  profileInfoContainer: {},
  text: {
    fontSize: 15,
    marginBottom: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  projectsTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  projectItem: {
    flex: 1,
    margin: 10,
    maxWidth: '50%',
  },
  projectImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  projectName: {
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  projectsList: {
    paddingBottom: 20,
  },
  noProjectsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  invite: {
    display: 'flex',
    backgroundColor: '#BE9DE8',
    width: 200,
    height: 40,
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 15,
  },
  inviteProject: {
    color: '#FFFFFF',
    top: 7,
    fontSize: 18,
    textAlign: 'center',
  },
  goback: {
    width: 55,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    top: 80,
  },
});
