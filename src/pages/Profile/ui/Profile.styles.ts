import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background_image: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#BE9DE8',
    width: '100%',
    // height: '15%',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  profileHeader: {
    top: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: '#FFFFFF',
    borderWidth: 10,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 55,
  },
  userName: {
    fontSize: 20,
    color: '#000000',
  },
  actionButtonsProfile: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    right: 0,
    gap: 16,
    padding: 16,
  },
  profileInfo: {
    paddingTop: 32,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});
