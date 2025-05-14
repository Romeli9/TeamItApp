import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {getSkills, getToken} from 'api';

export type Skill = {
  id: string;
  name: string;
  infoUrl: string;
  type: any[];
};

type SkillsInputProps = {
  selectedSkills: Skill[];
  setSelectedSkills: (skills: Skill[]) => void;
  type: 'ST1' | 'ST2';
};

export const SkillsInput: React.FC<SkillsInputProps> = ({
  selectedSkills,
  setSelectedSkills,
  type,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillsSuggestions, setSkillsSuggestions] = useState<Skill[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        getSkills(type, searchTerm, 15)
          .then(res => {
            setSkillsSuggestions(res.data.data);
          })
          .catch(async err => {
            if (err.response?.status === 401) {
              await getToken();
            }
          });
      } else {
        setSkillsSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchTerm, type]);

  const handleSelect = (skill: Skill) => {
    if (!selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSearchTerm('');
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId));
  };

  return (
    <View>
      <TextInput
        placeholder="Введите навык"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />

      {skillsSuggestions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled>
            {skillsSuggestions.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                style={styles.dropdownItem}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.selectedSkillsContainer}>
        {selectedSkills.map(skill => (
          <TouchableOpacity
            key={skill.id}
            onPress={() => removeSkill(skill.id)}
            style={styles.skillPill}>
            <Text style={styles.skillPillText}>{skill.name} ×</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    maxHeight: 150,
    overflow: 'scroll',
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  skillPill: {
    backgroundColor: '#dedede',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillPillText: {
    color: '#333',
  },
});
