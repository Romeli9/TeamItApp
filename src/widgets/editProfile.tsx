// EditProfile.js
import React, { useEffect, useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { loadFonts } from "shared/fonts/fonts";

type EditProfileProps = {
    onModalClose: () => void;
    onProjectDataChange: (projectData: any) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ onModalClose, onProjectDataChange }) => {
    const [isModalVisible, setModalVisible] = React.useState(true); // Устанавливаем true, чтобы модальное окно было видимым
    const [aboutMe, setAboutMe] = useState('');
    const [experience, setExperience] = useState('');
    const [skills, setSkills] = useState('');
    const [telegramm, setTelegramm] = useState('');
    const ModalClose = () => {
        setModalVisible(false);
        onModalClose();
    };
    const ModalCloseCreate = () => {
        dataProfile();
        setModalVisible(false);
        onModalClose();
    };
    useEffect(() => {
        const fetchData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) 
            {
                const usersRef = collection(FIREBASE_DB, 'users');
                const userDoc = doc(usersRef, user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) 
                {
                  const userData = docSnap.data();
                  setUsername(userData.username);
                  setUserImgUrl(userData.ImgUrl || '');
                  fetchUserProjects();
                }
            }
              
              await loadFonts();
              setFontsLoaded(true);
              
        };
        
            const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, fetchData);
            return unsubscribe;
          }, []);

    const dataProfile = async () => 
    {
        try 
        {
            if (!aboutMe.trim() || !experience.trim() || !skills.trim() || !telegramm.trim()) {
                alert('Пожалуйста, заполните все поля.');
                return;
            }
    
            const profileData = {
                AboutMe: aboutMe,
                Experience: experience,
                Skills: skills,
                Telegramm: telegramm
            };
    
            // Отправляем все данные профиля в базу данных Firebase
            const firestore = FIREBASE_DB;
            const profileRef = collection(firestore, 'profile');
            await addDoc(profileRef, profileData);
    
            // Вызываем колбэк, чтобы обновить данные профиля в родительском компоненте
            onProjectDataChange(profileData);
            console.log('Profile data successfully saved to Firebase:', profileData);
        }
        catch (error) 
        {
            console.error('Error edit profile: ', error);
        }
    }
    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                
                <Modal visible={isModalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={ModalClose}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                            <View>
                                <Text style={[styles.profile_aboutMe, { fontSize: 17 }]}>О себе</Text>
                            </View>
                            <View style={[styles.project__about__container1, { marginTop: 5 }]}>
                                <TextInput
                                    value={aboutMe}
                                    placeholder='Напишите о себе'
                                    autoCapitalize='none'
                                    placeholderTextColor="#A8A8A8" 
                                    onChangeText={(text) => setAboutMe(text)}
                                    style={styles.project_name__placeholder}
                                />
                            </View>
                            <View>
                                <Text style={[styles.profile_aboutMe, { fontSize: 17 }]}>Опыт</Text>
                            </View>
                            <View style={[styles.project__about__container2, { marginTop: 5 }]}>
                                <TextInput
                                    value={experience}
                                    placeholder='Ваш опыт'
                                    autoCapitalize='none'
                                    placeholderTextColor="#A8A8A8" 
                                    onChangeText={(text) => setExperience(text)}
                                    style={styles.project_name__placeholder}
                                />
                            </View>
                            <View>
                                <Text style={[styles.profile_aboutMe, { fontSize: 17 }]}>Навыки</Text>
                            </View>
                            <View style={[styles.project__about__container2, { marginTop: 5 }]}>
                                <TextInput
                                    value={skills}
                                    placeholder='Ваши навыки'
                                    autoCapitalize='none'
                                    placeholderTextColor="#A8A8A8" 
                                    onChangeText={(text) => setSkills(text)}
                                    style={styles.project_name__placeholder}
                                />
                            </View>
                            <View>
                                <Text style={[styles.profile_aboutMe, { fontSize: 17 }]}>Telegram</Text>
                            </View>
                            <View style={[styles.project__about__container2, { marginTop: 5 }]}>
                                <TextInput
                                    value={telegramm}
                                    placeholder='Ссылка на телеграмм'
                                    autoCapitalize='none'
                                    placeholderTextColor="#A8A8A8" 
                                    onChangeText={(text) => setTelegramm(text)}
                                    style={styles.project_name__placeholder}
                                />
                            </View>
                            <TouchableOpacity style={styles.project__button_create} onPress={ModalCloseCreate}>
                                <Text style={styles.project__text_create}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
            </View>
        </SafeAreaProvider>
    )
     
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    modalContent: {
        width: 316, // Уменьшаем ширину модального окна
        height: 450, // Уменьшаем высоту модального окна
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        position: 'relative',
    },
    project__button_create: {
      backgroundColor: "#9260D1",
      width: 177,
      height: 46,
      left: 50,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
      },
    project__text_create: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: "#FFFFFF",
      },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    closeButtonText: {
        fontSize: 24,
        color: 'white',
    },
    profile_aboutMe: {
        color: '#000000',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 5,
        width: 250,
        height: 27,
    },
    project__about__container1: {
        width: 274, // Вот здесь добавлено свойство marginTop
    },
    project__about__container2: {
        width: 274, // Вот здесь добавлено свойство marginTop
    },
    
});

export default EditProfile;
function setEditProfileVisible(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function setFontsLoaded(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function fetchUserProjects() {
    throw new Error("Function not implemented.");
}

function setUserImgUrl(arg0: any) {
    throw new Error("Function not implemented.");
}

function setUsername(username: any) {
    throw new Error("Function not implemented.");
}

