import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FireBaseConfig';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, getDocs } from 'firebase/firestore';
import ProjectWidget from '../widgets/ProjectWidget';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker'; // Import ImagePickerResponse

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  
  const [username, setUsername] = useState<string | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        const firestore = FIREBASE_DB;
        const usersRef = collection(firestore, 'users');
        const userDoc = doc(usersRef, user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setUserImgUrl(userData.ImgUrl || '');
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(FIREBASE_DB, 'projects'));
        const loadedProjects = projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const insets = useSafeAreaInsets();

  const pickImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    
    ImagePicker.showImagePicker(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        setProjectImage(source.uri);
      }
    });
  };
  

  const createProject = async () => {
    if (!projectName || !projectDescription || !projectImage || criteria.length === 0 || categories.length === 0) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const projectData = {
        name: projectName,
        description: projectDescription,
        avatarUrl: projectImage,
        criteria: criteria,
        categories: categories,
        creator: username || '',
      };

      const projectRef = await addDoc(collection(FIREBASE_DB, 'projects'), projectData);
      Alert.alert('Success', 'Project created successfully');
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Could not create project');
    }
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <Text style={{ fontSize: 28 }}>Hello {username}</Text>
        <ScrollView>
          {/* Button to open Modal */}
          <Button title="Create Project" onPress={() => setModalVisible(true)} />

          {/* List of existing projects */}
          {projects.map((project) => (
            <ProjectWidget
              key={project.id}
              projectName={project.name}
              projectDescription={project.description}
              projectAvatarUrl={project.avatarUrl}
              criteria={project.criteria}
              categories={project.categories}
              creator={project.creator}
              onDelete={() => {}}
            />
          ))}
        </ScrollView>

        {/* Modal for creating a new project */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Create Project</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Project Name"
                  value={projectName}
                  onChangeText={(text) => setProjectName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Project Description"
                  value={projectDescription}
                  onChangeText={(text) => setProjectDescription(text)}
                  multiline={true}
                />
                {projectImage ? (
                  <Image source={{ uri: projectImage }} style={{ width: 200, height: 200, marginBottom: 10 }} />
                ) : null}
                <Button title="Pick Image" onPress={pickImage} />
                <TextInput
                  style={styles.input}
                  placeholder="Criteria (comma separated)"
                  value={criteria.join(', ')}
                  onChangeText={(text) => setCriteria(text.split(',').map((item) => item.trim()))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Categories (comma separated)"
                  value={categories.join(', ')}
                  onChangeText={(text) => setCategories(text.split(',').map((item) => item.trim()))}
                />
                <Button title="Create Project" onPress={createProject} />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
