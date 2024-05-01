import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';

import { categories } from '../shared/consts/Categories';
import { required } from '../shared/consts/Required';
import { LinearGradient } from 'expo-linear-gradient';

interface ProjectModalProps {
  isModalVisible: boolean;
  ModalClose: () => void;
  onImageLibraryPress: () => void;
  selectedImage: string | null;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  projectDescRaw: string;
  setProjectDescRaw: React.Dispatch<React.SetStateAction<string>>;
  requiredOpen: boolean;
  toggleRequired: () => void;
  requiredSelected: string[];
  handleRequiredSelect: (value: string) => void;
  categoriesOpen: boolean;
  toggleCategory: () => void;
  categoriesSelected: string[];
  handleCategorySelect: (value: string) => void;
  CreateProject: () => void;
  members: string[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isModalVisible,
  ModalClose,
  onImageLibraryPress,
  selectedImage,
  projectName,
  setProjectName,
  projectDescRaw,
  setProjectDescRaw,
  requiredOpen,
  toggleRequired,
  requiredSelected,
  handleRequiredSelect,
  categoriesOpen,
  toggleCategory,
  categoriesSelected,
  handleCategorySelect,
  CreateProject,
  members
}) => {

   

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent>
      <LinearGradient 
      style={styles.modalContainer}
      colors={[
        'rgba(46, 10, 95, 0.94)',
        'rgba(177, 170, 219, 0.6043)',
        'rgba(31, 24, 75, 0.94)',
      ]}>
      
        <View style={styles.modalContent}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.closeButton} onPress={ModalClose}>
              <Image source={require('../shared/icons/cros.png')} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Создание проекта</Text>
            <TouchableOpacity style={styles.add_image__button} onPress={onImageLibraryPress}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <Text style={styles.add_image__text}>+</Text>
              )}
            </TouchableOpacity>
            <TextInput
              value={projectName}
              placeholder='Введите название'
              autoCapitalize='none'
              placeholderTextColor="#A8A8A8"
              onChangeText={(text) => setProjectName(text)}
              style={styles.project_name__placeholder}
            />
            <View style={styles.project__about__container}>
              <Text style={styles.project__text}>О проекте:</Text>
              <TextInput
                value={projectDescRaw}
                placeholder='Описание'
                autoCapitalize='none'
                placeholderTextColor="#A8A8A8"
                onChangeText={(text) => setProjectDescRaw(text)}
                style={styles.project_name__placeholder_about}
                multiline={true}
                keyboardType="default"
              />
            </View>

            <View style={styles.project__container_with_plus}>
              <Text style={styles.project__text_2}>Требуются:</Text>
              <View style={styles.fdrow}>
                <TouchableOpacity style={styles.project__button_plus} onPress={toggleRequired}>
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>
                {requiredSelected.map((item) => (
                  <View key={item} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item}</Text>
                    <TouchableOpacity onPress={() => handleRequiredSelect(item)} style={styles.removeSelectedItem}>
                      <View style={styles.removeSelectedItemTextContainer}>
                        <Image source={require('../shared/icons/cros2.png')} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {requiredOpen && (
                <ScrollView style={styles.dropdownContainer}>
                  <View style={styles.dropdownWrapper}>
                    {required.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[styles.dropdownItem, requiredSelected.includes(item.value) && styles.dropdownItemSelected]}
                        onPress={() => handleRequiredSelect(item.value)}>
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Image source={require('../shared/icons/plus2.png')} />
                          </View>
                          <Text style={styles.dropdownItemText}>{item.value}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View style={styles.project__container_with_plus}>
              <Text style={styles.project__text_2}>Категории:</Text>
              <View style={styles.fdrow}>
                <TouchableOpacity style={styles.project__button_plus} onPress={toggleCategory}>
                  <Image source={require('../shared/icons/plus1.png')} />
                </TouchableOpacity>
                {categoriesSelected.map((item) => (
                  <View key={item} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>{item}</Text>
                    <TouchableOpacity onPress={() => handleCategorySelect(item)} style={styles.removeSelectedItem}>
                      <View style={styles.removeSelectedItemTextContainer}>
                        <Image source={require('../shared/icons/cros2.png')} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {categoriesOpen && (
                <ScrollView style={styles.dropdownContainer}>
                  <View style={styles.dropdownWrapper}>
                    {categories.map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.dropdownItem,
                          categoriesSelected.includes(item.value) && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleCategorySelect(item.value)}>
                        <View style={styles.dropdownItemContainer}>
                          <View style={styles.dropdownItem_icon}>
                            <Image source={require('../shared/icons/plus2.png')} />
                          </View>
                          <Text style={styles.dropdownItemText}>{item.value}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
            <TouchableOpacity style={styles.project__button_create} onPress={CreateProject}>
              <Text style={styles.project__text_create}>Создать</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      
      </LinearGradient>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.4)',
    //backgroundColor: 'linear-gradient(rgba(46, 10, 95, 0.94), rgba(177, 170, 219, 0.6043), rgba(31, 24, 75, 0.94))'

  },
  modalContent: {
    width: 316,
    height: '91.25%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 27,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: '90%',
    marginTop: 5,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  add_image__button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    width: 64,
    height: 75,
    borderRadius: 20,
    marginTop: 11,
    marginBottom: 13,
  },
  add_image__text: {
    fontFamily: 'Inter-Regular',
    fontSize: 48,
    color: '#FFFFFF',
  },
  project_name__placeholder: {
    backgroundColor: '#EDEDED',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: 274,
    height: 42,
  },
  project_name__placeholder_about: {
    backgroundColor: '#EDEDED',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#A8A8A8',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 18,
    width: 274,
    minHeight: 100,
    maxHeight: 185,
    alignItems: "flex-start",
    alignSelf: "flex-start",
    textAlignVertical: 'top',
  },
  project__about__container: {
    width: 274,
    minHeight: 100,
  },
  project__text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 12,
    marginTop: 15,
    marginBottom: 10,
  },
  project__text_2: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  project__container_with_plus: {
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  fdrow: {
    flexDirection: 'row',
    flexWrap: "wrap",
    gap: 15,
    margin: 0
  },
  project__button_plus: {
    backgroundColor: "#BE9DE8",
    width: 34,
    height: 21,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    gap: 15,
  },
  project__button_create: {
    backgroundColor: "#9260D1",
    width: 177,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 85,
  },
  project__text_create: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: "#FFFFFF",
  },
  selectedImage: {
    width: 64,
    height: 75,
    borderRadius: 20,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flexWrap: "wrap"
  },
  selectedItem: {
    backgroundColor: '#BE9DE8',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
    paddingVertical: 3,
    paddingHorizontal: 3
  },
  selectedItemText: {
    color: 'white',
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
  removeSelectedItem: {
    marginLeft: 5,
  },
  removeSelectedItemTextContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6.5,
    paddingVertical: 2.5,
    borderRadius: 20,
    height: 12,
  },
  removeSelectedItemText: {
    color: '#BBBBBB',
    textAlign: "center",
  },
  dropdownContainer: {
    position: 'relative',
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
    fontFamily: "Inter-SemiBold",
  },
  dropdownItem_icon: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: "#FFFFFF",
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
});

export default ProjectModal;
