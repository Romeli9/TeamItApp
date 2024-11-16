import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers';

export const HeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    gap: 30,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.White100,
    paddingHorizontal: 10,
  },
  logo: {
    height: 30,
  },
  input: {
    backgroundColor: Colors.Gray200,
    color: Colors.Black200,
    padding: 0,
    paddingHorizontal: 10,
    height: 30,
    fontSize: 14,
  },
  inputContainerStyle: {
    flex: 1,
  },
  border: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.Gray200,
  },
  chatTitle: {
    display: 'flex',
    alignItems: 'flex-end',
  },
});
