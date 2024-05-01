import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


const ProjectCarouselItem: React.FC<{ project: any; isCenter: boolean }> = ({
    project,
    isCenter,
  }) => {
    return (
      <View style={styles.carouselItem}>
        {isCenter ? (
          <>
            <Image source={{ uri: project.photo }} style={styles.projectImage} />
            <Text style={styles.projectTitle}>{project.name}</Text>
          </>
        ) : (
          <Image source={{ uri: project.photo }} style={styles.projectImage} />
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselItem: {
    alignItems: 'center', // Центрируем элементы по горизонтали внутри карусели
    justifyContent: 'center', // Центрируем элементы по вертикали внутри карусели
  },
  projectImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Делаем круглое изображение
  },
  projectTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ProjectCarouselItem;
