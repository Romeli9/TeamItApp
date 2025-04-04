import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

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

  // carousel: {
  //   marginTop: 20,
  //   width: '100%',
  //   height: 300,
  // },
  imageContainer: {
    width: '100%',
    height: 300, // Высота изображения
  },

  // carouselItem: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  centeredItem: {
    width: 165, // Увеличиваем ширину центрального элемента
    height: 259, // Высота центрального элемента
  },

  // gradient: {
  //   ...StyleSheet.absoluteFillObject,
  // },

  // sideItem: {
  //   width: 134.23,
  //   height: 227.41,
  // },
  // image: {
  //   width: 165,
  //   height: 259,
  //   borderRadius: 20,
  //   overflow: 'hidden',
  // },

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
    position: 'absolute',
    bottom: -130,
    left: -240,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '40%',
    justifyContent: 'flex-end',
    padding: 16,
    borderRadius: 20,
  },
  projectTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselWrapper: {
    width: '100%',
    overflow: 'visible',
  },
  carouselItem: {
    width: screenWidth * 0.7,
    height: 340,
    borderRadius: 20,
    marginLeft: screenWidth / 5,
  },
  activeItem: {
    transform: [{scale: 1}],
    zIndex: 3,
  },
  sideItem: {
    transform: [{scale: 0.9}],
    zIndex: 1,
    opacity: 0.9,
  },
});
