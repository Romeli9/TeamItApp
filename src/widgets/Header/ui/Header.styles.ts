import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const HeaderStyles = StyleSheet.create({
  container: {
    paddingTop: 15,
    marginTop: 15,
    flexDirection: 'row',
    height: 60,
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
    top: 50,
    left: '50%',
    transform: [{translateX: '-50%'}, {translateY: '-50%'}],
  },
});
