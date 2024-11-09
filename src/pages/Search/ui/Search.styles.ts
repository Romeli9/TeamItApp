import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const SearchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  boxesContainer: {
    marginTop: 10,
    display: 'flex',
    flex: 1,
  },
  containerboxed1: {
    position: 'absolute',
    left: 0,
    flexDirection: 'column',
    flex: 1,
  },
  containerboxed2: {
    position: 'absolute',
    right: 0,
    flexDirection: 'column',
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  textStyle1: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#808080',
    marginBottom: 15,
  },
  textStyle2: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#808080',
  },
});
