import {StyleSheet} from 'react-native';

import {Colors} from 'shared/libs/helpers/colors';

export const ProjectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
    paddingBottom: 60,
  },

  goback: {
    width: 55,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 14,
    top: 161,
  },

  projectImage: {
    width: '100%',
    height: 236,
    borderRadius: 40,
    marginBottom: 15,
    overflow: 'hidden',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
  },

  about_project_container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },

  about_project_name: {
    textTransform: 'uppercase',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 20,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
    marginTop: 12,
  },

  about_project_desc: {
    padding: 16,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(51, 51, 51, 1)',
    textAlign: 'justify',
    marginTop: 5,
    marginBottom: 16,
  },

  required_container: {
    width: '94%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    marginVertical: 14,
  },

  requider_name: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 5,
  },
  invite: {
    position: 'relative',
    top: 25,
    backgroundColor: '#BE9DE8',
    width: 225,
    height: 50,
    borderRadius: 50,
    marginTop: 10,
  },
  inviteProject: {
    color: '#FFFFFF',
    top: 13,
    fontSize: 18,
    textAlign: 'center',
  },
  required_contnainer_2: {
    //width: '95%',
    //flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'flex-start',
    //paddingBottom: 10,
    overflow: 'hidden',
  },

  required_offer_container: {
    marginRight: 9,
    width: 71,

    //height: 80,
    flexDirection: 'column',
    alignItems: 'center',
  },

  required_text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: '#262626',
    textAlign: 'center',
    marginTop: 5,
  },

  required_button_wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAEAEA',
  },

  required_image: {
    opacity: 0.2,
  },

  required_image_2: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  categories_container: {
    width: '94%',
    height: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingTop: 14,
    paddingBottom: 14,
  },

  categories_container_2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 19,
    gap: 6,
    marginTop: 4,
    width: 'auto',
  },

  categories_name: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'left',

    marginLeft: 19,
  },

  categoires_wrapper: {
    backgroundColor: '#9D69DE',
    borderRadius: 30,
    height: 23,
    paddingHorizontal: 8,
    //marginTop: 11,
    marginRight: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoires_text: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    textAlign: 'center',
  },

  author_container: {
    marginTop: 14,
    width: 232,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },

  author_name: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
    marginTop: 5,
  },

  author_image: {
    width: 27,
    height: 27,
    borderRadius: 40,
  },

  author_wrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 3,
  },

  author_text: {
    marginTop: 7,
    marginLeft: 5,
    marginRight: 6,
  },

  modalContainer: {
    position: 'absolute',
    top: 560,
    left: 120,
  },

  modalContainer_2: {
    position: 'absolute',
    top: 560,
    left: 20,
  },

  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 158,
    paddingTop: 7,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 7.5,
    backgroundColor: '#BE9DE8',
    borderRadius: 40,
  },

  modalContent_2: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.71)',
    // width: 158,

    paddingHorizontal: 7,
    paddingBottom: 10,
    paddingTop: 8,
    borderRadius: 40,
  },

  application_contanier: {
    flex: 1,
    flexDirection: 'row',
    width: 158,
    height: 30,
    backgroundColor: '#BE9DE8',
    borderRadius: 40,
  },

  application_ok_button: {
    opacity: 0.79,
    marginLeft: 9,
    marginTop: -5,
  },

  application_not_ok_button: {
    marginLeft: 9,
    marginTop: -3,
  },

  application_text: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },

  application_text_2: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },

  buttonsContainer: {
    flexDirection: 'row',
  },
  dropdownContainer: {
    position: 'absolute',
    maxHeight: 150,
    width: 160,
    backgroundColor: '#BE9DE8',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    zIndex: 999,
    marginTop: 15,
  },
  dropdownWrapper: {
    paddingTop: 13,
    paddingLeft: 6,
    paddingRight: 13,
    paddingBottom: 5,
  },
  dropdownItem: {
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  dropdownItem_icon: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemContainer: {
    flex: 1,
    paddingLeft: 11,
    flexDirection: 'row',
  },
  dropdownItemText: {
    marginLeft: 5,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  dropdownItemSelected: {
    //backgroundColor: '#F2F2F2',
  },

  effect__top: {
    //zIndex: -10,
    position: 'absolute',
    top: -175,
    left: -65,
    //width: '100%',
  },

  skillsContainer: {
    width: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 15,
    marginTop: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#E8D9FF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6A3BB5',
  },
});
