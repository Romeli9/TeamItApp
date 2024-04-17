import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FireBaseConfig';
import { getUserById } from '../services/getUserById';

const MemberAvatar: React.FC<{ userId: string, num: number }> = ({ userId, num }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(userId); // Загрузка данных пользователя по ID
        setUser(userData);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user || !user.avatar) {
    return null;
  }

  return (
    <>
      {user.avatar && num === 1 ? (
        <Image source={{ uri: user.avatar }} style={styles.required_image_2} />
      ) : (
        <Image source={{ uri: user.avatar }} style={styles.author_image} />
      )}
    </>
  );
};

const Project: React.FC<any> = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<string[]>([]);
  const [openSendIndex, setOpenSendIndex] = useState<number | null>(null); // Индекс роли для подачи заявки
  const [modalVisible, setModalVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const buttonRef = useRef<any>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectRef = doc(FIREBASE_DB, 'projects', projectId);
        const docSnap = await getDoc(projectRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProjectData(data);
        } else {
          console.log('Документ не найден!');
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных о проекте:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const toggleRequired = () => {
    // Дополнительная логика, если нужно
  }

  const sendApplication = (index: number) => {
    const updatedApplications = [...applications];
    updatedApplications[index] = 'sent';
    setApplications(updatedApplications);
    setOpenSendIndex(null);
    setModalVisible(false); // Закрываем модальное окно после подачи заявки
  }

  const openApplicationModal = (index: number) => {
    setOpenSendIndex(index);

    setModalVisible(true); // Открываем модальное окно при нажатии на кнопку "Подать заявку"
  }

  const closeApplicationModal = () => {
    setModalVisible(false); // Закрываем модальное окно при нажатии на кнопку "Отмена"
  }


  return (
    <SafeAreaProvider>
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#EAEAEA' }}>
          <View style={styles.container}>
            <Image source={{ uri: projectData.photo }} style={styles.projectImage} />

            <View style={styles.about_project_container}>
              {/* <Text style = {styles.about_project_name} >{projectData.name}</Text> */}
              <Text style={styles.about_project_name} >РАЗРАБОТКА ЧАТ-БОТА ДЛЯ ЗНАКОМСТВ</Text>

              {/* <Text style = {styles.about_project_desc}>{projectData.description}</Text> */}
              <Text style={styles.about_project_desc}>Разработка сервиса, в котором любой человек сможет заполнить анкету о своих интересах, роде деятельности и навыках, а алгоритм подберет для него потенциальных собеседников со схожими интересами.</Text>
            </View>

            <View style={styles.required_container}>
              <Text style={styles.requider_name}>Требуются:</Text>
              <View style={{ width: '95%', marginLeft: 8 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.required_contnainer_2}
                >
                  <View style={styles.required_offer_container}>
                    <TouchableOpacity onPress={toggleRequired} style={styles.required_button_wrapper}>
                      <Image source={require('../shared/icons/plus3.png')} style={styles.required_image} />
                    </TouchableOpacity>
                    <Text style={styles.required_text}>Предложить</Text>
                  </View>
                  {projectData.required.map((required: string, index: number) => (
                    <View style={styles.required_offer_container} key={index}>
                      {projectData.members[index] === "-" ? (
                        <TouchableOpacity
                          ref={buttonRef}
                          onPress={() => {
                            openApplicationModal(index);
                          }}
                          style={styles.required_button_wrapper}
                        >
                          <Image source={require('../shared/icons/plus3.png')} style={styles.required_image} />
                        </TouchableOpacity>
                      ) : (
                        <MemberAvatar userId={projectData.members[index]} num={1} />
                      )}
                      <Text style={styles.required_text}>{required}</Text>
                      {openSendIndex === index && (
                        <Modal
                          animationType='slide'
                          transparent={true}
                          visible={modalVisible}
                          onRequestClose={closeApplicationModal}
                        >
                          <View style={[styles.modalContainer]}>
                            <View style={styles.modalContent}>
                              <Text style={styles.application_text}>Подать заявку?</Text>
                              <TouchableOpacity onPress={() => sendApplication(openSendIndex)}>
                                <Image source={require('../shared/icons/check.png')} style={styles.application_ok_button}></Image>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={closeApplicationModal}>
                                <Image source={require('../shared/icons/p.png')} style={styles.application_not_ok_button}></Image>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.categories_container}>
              <Text style={styles.categories_name}>Категории:</Text>
              <View style={{ width: '96%', marginLeft: 10 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categories_container_2}
                >
                  {projectData.categories.map((categories: string) => (
                    <View style={styles.categoires_wrapper}>
                      <Text style={styles.categoires_text}>{categories}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>



            <View style={styles.author_container}>
              <Text style={styles.author_name}>Автор идеи:</Text>
              <View style={styles.author_wrapper}>
                <MemberAvatar userId={projectData.creatorId} num={2}></MemberAvatar>
                <Text style={styles.author_text}>{projectData.creator}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goback}>
              <Image source={require('../shared/icons/arrow.png')} />
            </TouchableOpacity>

          </View>
        </View>
    </SafeAreaProvider >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
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
    marginBottom: 5,
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
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(51, 51, 51, 1)',
    textAlign: 'center',
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

  required_contnainer_2: {
    //width: '95%',
    //flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'flex-start',
    //paddingBottom: 10,
    overflow: 'hidden',
  },

  required_offer_container: {
    marginLeft: 19,
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
    backgroundColor: '#EAEAEA'
  },

  required_image: {
    opacity: 0.2,
  },

  required_image_2: {
    width: 50,
    height: 50,
  },

  categories_container: {
    width: '94%',
    height: 71,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },

  categories_container_2: {
    //flex: 1,
    //flexDirection: "row",
    //marginLeft: 19,
    marginTop: 4,
    width: 'auto',
  },

  categories_name: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'left',
    marginTop: 11,
    marginLeft: 19,
    //marginBottom: 5,
  },

  categoires_wrapper: {
    backgroundColor: '#9D69DE',
    borderRadius: 30,
    height: 23,
    paddingHorizontal: 8,
    paddingTop: 2,
    marginRight: 11,
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
    marginRight: 6
  },

  modalContainer: {
    position: 'absolute',
    top: 560,
    left: 120
  },

  modalContent: {
    flexDirection: 'row',

    // width: 158,
    paddingTop: 7,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 7.5,
    backgroundColor: '#BE9DE8',
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
    opacity: 0.79,
    marginLeft: 9,
    marginTop: -3,
  },

  application_text: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Project;
