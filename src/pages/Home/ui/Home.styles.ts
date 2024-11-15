import {StyleSheet} from 'react-native';

export const HomePagestyles = StyleSheet.create({
  create__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 82,
    height: 120,
    borderRadius: 20,
  },
  create__text: {
    fontSize: 64,
    color: '#FFFFFF',
  },

  selectedImage: {
    width: 64,
    height: 75,
    borderRadius: 20,
  },

  userProjectsContainer: {
    flexDirection: 'row',
    marginTop: 13,
    paddingLeft: 10,
    paddingRight: 25,
    //height: 155,
    marginLeft: -9,
  },
  projectItem: {
    marginLeft: 13,
  },
  projectImage: {
    width: 82,
    height: 120,
    borderRadius: 20,
  },

  workWithProjectsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#BE9DE8',
    paddingTop: 21,
  },
  workWithProjectsText: {
    marginLeft: 21,
    fontSize: 21,
    fontFamily: 'Inter-Bold',
    textAlign: 'left',
    color: '#FFFFFF',
    lineHeight: 27,
    width: 220,
    // height: 72
  },

  searchButton: {
    position: 'absolute',
    top: 23,
    right: 28,
  },

  carousel: {
    marginTop: 20,
    width: '100%',
    height: 300,
  },
  imageContainer: {
    width: '100%',
    height: 300, // Высота изображения
  },
  projectTitle: {
    fontSize: 16,
    fontFamily: 'Inter-ExtraBold',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    width: 314,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },

  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredItem: {
    width: 165, // Увеличиваем ширину центрального элемента
    height: 259, // Высота центрального элемента
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  sideItem: {
    width: 134.23,
    height: 227.41,
  },
  image: {
    width: 165,
    height: 259,
    borderRadius: 20,
    overflow: 'hidden',
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  TextContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 7,
  },

  TextContainer__text1: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#808080',
  },

  TextContainer__text1_img: {
    marginLeft: 3,
  },

  TextContainer__text2: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
  },

  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -10,
  },

  imageGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  effect: {
    //zIndex: -10,
    position: 'absolute',
    bottom: -130,
    left: -240,
    //width: '100%',
  },
});
