import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {ProjectType, selectProjectById} from 'redux/slices/projectsSlice';
import {getUserById} from 'services/getUserById';
import {required} from 'shared/assets/consts/Required';
import {ArrowLeftIcon, CheckIcon, CloseIcon, PlusIcon} from 'shared/icons';
import {Colors} from 'shared/libs/helpers';
import {MemberAvatar} from 'shared/ui';

import {ProjectStyles as styles} from './Project.styles';

export const Project: React.FC<any> = ({route, navigation}) => {
  const {projectId} = route.params;
  const projectData: ProjectType | undefined = useSelector(
    selectProjectById(projectId),
  );
  const [openSendIndex, setOpenSendIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationTimer, setConfirmationTimer] = useState<any>(null);
  const [requiredOpen, setRequiredOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const insets = useSafeAreaInsets();
  const buttonRef = useRef<any>(null);

  const openApplicationModal = (index: number) => {
    setOpenSendIndex(index);

    setModalVisible(true);
  };

  const closeApplicationModal = () => {
    setModalVisible(false);
  };

  const showConfirmation = () => {
    setConfirmationVisible(true);
    const timer = setTimeout(() => {
      setModalVisible(false);
      setConfirmationVisible(false);
    }, 2000);
    setConfirmationTimer(timer);
  };

  const toggleRequired = () => {
    setRequiredOpen(!requiredOpen);
    setSelectedItem('');
  };

  const HandleApplicationSend = (value: string) => {
    setSelectedItem(value);
  };

  if (!projectData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Проект не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View
        style={{flex: 1, paddingTop: insets.top, backgroundColor: '#EAEAEA'}}>
        <ScrollView contentContainerStyle={styles.container}>
          <ImageBackground
            source={{uri: projectData.photo}}
            style={[styles.projectImage]}></ImageBackground>

          <View style={styles.about_project_container}>
            <Text style={styles.about_project_name}>{projectData.name}</Text>
            {/* <Text style={styles.about_project_name} >РАЗРАБОТКА ЧАТ-БОТА ДЛЯ ЗНАКОМСТВ</Text> */}

            <Text style={styles.about_project_desc}>
              {projectData.description}
            </Text>
            {/* <Text style={styles.about_project_desc}>
              Разработка сервиса, в котором любой человек сможет заполнить
              анкету о своих интересах, роде деятельности и навыках, а алгоритм
              подберет для него потенциальных собеседников со схожими
              интересами.Разработка сервиса, в котором любой человек сможет
              заполнить анкету о своих интересах, роде деятельности и навыках, а
              алгоритм подберет для него потенциальных собеседников со схожими
              интересами.Разработка сервиса, в котором любой человек сможет
              заполнить анкету о своих интересах, роде деятельности и навыках, а
              алгоритм подберет для него потенциальных собеседников со схожими
              интересами.Разработка сервиса, в котором любой человек сможет
              заполнить анкету о своих интересах, роде деятельности и навыках, а
              алгоритм подберет для него потенциальных собеседников со схожими
              интересами.Разработка сервиса, в котором любой человек сможет
              заполнить анкету о своих интересах, роде деятельности и навыках, а
              алгоритм подберет для него потенциальных собеседников со схожими
              интересами.
            </Text> */}
          </View>

          <View style={styles.required_container}>
            <Text style={styles.requider_name}>Требуются:</Text>
            <View style={{width: '95%', marginLeft: 8}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.required_contnainer_2}>
                <View style={styles.required_offer_container}>
                  <TouchableOpacity
                    onPress={toggleRequired}
                    style={styles.required_button_wrapper}>
                    <Text style={styles.required_image}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.required_text}>Предложить</Text>
                </View>
                <Image
                  source={require('shared/assets/icons/slash.png')}
                  style={{height: 50, marginLeft: 5.5, marginRight: 11.5}}
                />
                {projectData.required.map((required: string, ix: number) => (
                  <View style={styles.required_offer_container} key={ix}>
                    {projectData.members[ix] === '-' ? (
                      <TouchableOpacity
                        ref={buttonRef}
                        onPress={() => {
                          openApplicationModal(ix);
                        }}
                        style={styles.required_button_wrapper}>
                        <Text style={styles.required_image}>+</Text>
                      </TouchableOpacity>
                    ) : (
                      <MemberAvatar userId={projectData.members[ix]} num={1} />
                    )}
                    <Text style={styles.required_text}>{required}</Text>
                    {openSendIndex === ix && (
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeApplicationModal}>
                        <View style={styles.modalContainer}>
                          {confirmationVisible ? (
                            <View style={styles.modalContent_2}>
                              <Text style={styles.application_text_2}>
                                Заявка отправлена
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.modalContent}>
                              <Text style={styles.application_text}>
                                Подать заявку?
                              </Text>
                              <TouchableOpacity onPress={showConfirmation}>
                                <CheckIcon
                                  width={20}
                                  height={23}
                                  fill={Colors.White100}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={closeApplicationModal}>
                                <CloseIcon
                                  width={20}
                                  height={23}
                                  fill={Colors.White100}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </Modal>
                    )}
                  </View>
                ))}
              </ScrollView>
              {requiredOpen && (
                <Modal
                  transparent={true}
                  visible={requiredOpen}
                  onRequestClose={toggleRequired}>
                  <View style={styles.modalContainer_2}>
                    {selectedItem !== '' ? (
                      <View style={styles.modalContent}>
                        <Text style={styles.application_text}>
                          Вы хотите подать заявку на "{selectedItem}"?
                        </Text>
                        <TouchableOpacity onPress={toggleRequired}>
                          <CheckIcon
                            width={20}
                            height={23}
                            fill={Colors.White100}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleRequired}>
                          <CloseIcon
                            width={20}
                            height={23}
                            fill={Colors.White100}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <ScrollView style={styles.dropdownContainer}>
                        <View style={styles.dropdownWrapper}>
                          {required.map(item => (
                            <TouchableOpacity
                              key={item.key}
                              style={[
                                styles.dropdownItem,
                                styles.dropdownItemSelected,
                              ]}
                              onPress={() => HandleApplicationSend(item.value)}>
                              <View style={styles.dropdownItemContainer}>
                                <View style={styles.dropdownItem_icon}>
                                  <PlusIcon />
                                </View>
                                <Text style={styles.dropdownItemText}>
                                  {item.value}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    )}
                  </View>
                </Modal>
              )}
            </View>
          </View>

          <View style={styles.categories_container}>
            <Text style={styles.categories_name}>Категории:</Text>

            <View style={styles.categories_container_2}>
              {projectData.categories.map((categories: string, ix: number) => (
                <View key={ix} style={styles.categoires_wrapper}>
                  <Text style={styles.categoires_text}>{categories}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.author_container}>
            <Text style={styles.author_name}>Автор идеи:</Text>
            <View style={styles.author_wrapper}>
              <MemberAvatar userId={projectData.creatorId} num={2} />
              <Text style={styles.author_text}>{projectData.creator}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goback}>
            <ArrowLeftIcon />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};
