import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CategorySelector } from '../CategorySelector';
import { Category } from '../../types/common.type';

interface TodoInputProps {
  categories: Category[];
  onAddTodo: (text: string, categories: string[]) => Promise<void>;
}

export const TodoInput: React.FC<TodoInputProps> = ({ categories, onAddTodo }) => {
  const [newTodo, setNewTodo] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleAddTodo = async () => {
    if (newTodo.trim() === '' || newTodo.length > 100) {
      Alert.alert('Error', 'La tarea debe tener entre 1 y 100 caracteres');
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Seleccione al menos una categoría');
      return;
    }

    try {
      await onAddTodo(newTodo, selectedCategories);
      setNewTodo('');
      setSelectedCategories([]);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Añadir nueva tarea..."
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            (newTodo.trim() === '' || selectedCategories.length === 0) 
              ? styles.addButtonDisabled 
              : styles.addButtonEnabled
          ]}
          onPress={handleAddTodo}
          disabled={newTodo.trim() === '' || selectedCategories.length === 0}
        >
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategorySelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonEnabled: {
    backgroundColor: '#007AFF',
  },
  addButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});