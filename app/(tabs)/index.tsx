import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const STORAGE_KEY = '@todos';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (e) {
      Alert.alert('Error', 'No se pudieron guardar las tareas');
    }
  };

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const newTodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [newTodoItem, ...todos];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodo('');
    Keyboard.dismiss();
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedTodos = todos.filter(todo => todo.id !== id);
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.todoItem,
            { backgroundColor: isActive ? '#F0F0F0' : '#FFFFFF' }
          ]}
        >
          <View style={styles.todoContent}>
            <TouchableOpacity
              style={styles.todoCheckbox}
              onPress={() => toggleTodo(item.id)}
            >
              <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                {item.completed && (
                  <Icon name="check" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            
            <Text
              style={[
                styles.todoText,
                item.completed && styles.todoTextCompleted
              ]}
            >
              {item.text}
            </Text>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodo(item.id)}
            >
              <Icon name="delete" size={20} color="#CC2F26" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Tareas</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Añadir nueva tarea..."
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={addTodo}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                newTodo.trim() === '' ? styles.addButtonDisabled : styles.addButtonEnabled
              ]}
              onPress={addTodo}
              disabled={newTodo.trim() === ''}
            >
              <Icon name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <DraggableFlatList
          data={todos}
          onDragEnd={({ data }) => {
            setTodos(data);
            saveTodos(data);
          }}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 45,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  listContent: {
    padding: 20,
  },
  todoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  todoCheckbox: {
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  todoText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  deleteButton: {
    padding: 8,
  },
});

export default App;