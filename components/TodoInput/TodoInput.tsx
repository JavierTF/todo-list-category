import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Modal, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CategorySelector } from '../CategorySelector';
import { Category } from '../../types/common.type';
import { CustomAlert } from '../CustomAlert/CustomAlert';

interface TodoInputProps {
  categories: Category[];
  onAddTodo: (text: string, categories: string[]) => Promise<void>;
}

export const TodoInput: React.FC<TodoInputProps> = ({ categories, onAddTodo }) => {
  const [newTodo, setNewTodo] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '' || newTodo.length > 100) {
      showAlert('Error', 'La tarea debe tener entre 1 y 100 caracteres');
      return;
    }
    if (selectedCategories.length === 0) {
      showAlert('Error', 'Seleccione al menos una categoría');
      return;
    }

    try {
      await onAddTodo(newTodo, selectedCategories);
      setNewTodo('');
      setSelectedCategories([]);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error adding todo:', error);
      showAlert('Error', 'No se pudo crear la tarea');
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
        >
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <CategorySelector
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategorySelection}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
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

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});