import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const HeaderStyles = StyleSheet.create({
  container: {
    paddingTop: 35,
    marginTop: 5,
    flexDirection: 'row',
    height: 90,
    gap: 30,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.White100,
    paddingHorizontal: 10,
  },
  border: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.Gray200,
  },
  chatTitle: {
    position: 'absolute',
    top: 60,
    left: '50%',
    transform: [{translateX: '-50%'}, {translateY: '-50%'}],
  },
});
