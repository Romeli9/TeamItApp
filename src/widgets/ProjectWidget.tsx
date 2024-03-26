import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ProjectWidgetProps {
  projectName: string;
  projectDescription: string;
  projectAvatarUrl: string;
  criteria: string[];
  categories: string[];
  creator: string;
  onDelete: () => void;
}

const ProjectWidget: React.FC<ProjectWidgetProps> = ({
  projectName,
  projectDescription,
  projectAvatarUrl,
  criteria,
  categories,
  creator,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
      }}
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: projectAvatarUrl }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
        <Text style={{ fontSize: 18 }}>{projectName}</Text>
      </View>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>{projectDescription}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}>
        {criteria.map((criterion, index) => (
          <View key={index} style={{ backgroundColor: '#f0f0f0', padding: 5, marginRight: 5, marginBottom: 5 }}>
            <Text>{criterion}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {categories.map((category, index) => (
          <View key={index} style={{ backgroundColor: '#f0f0f0', padding: 5, marginRight: 5, marginBottom: 5 }}>
            <Text>{category}</Text>
          </View>
        ))}
      </View>
      {creator === 'CurrentUser' ? (
        <TouchableOpacity onPress={onDelete} style={{ marginTop: 10, backgroundColor: 'red', padding: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default ProjectWidget;
