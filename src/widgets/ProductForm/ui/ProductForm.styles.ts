import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ProductFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White100,
  },
  content: {},
  inputs: {
    gap: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.Green500,
    borderRadius: 10,
  },
  loader: {
    height: 24,
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.Green500,
  },
  filled: {
    backgroundColor: Colors.Green500,
  },
  textarea: {
    height: 200,
    textAlignVertical: 'top',
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.Gray200,
    borderRadius: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
    padding: 6,
    borderRadius: '100%',
    backgroundColor: Colors.Black100Opacity20,
  },
});
