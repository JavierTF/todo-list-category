import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams
} from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { normalize } from '../../utils/normalize';
import { Category, Todo } from '@/types/common.type';
import { DEFAULT_CATEGORIES } from '@/constants/DefaultCategories';
import { STORAGE_KEY_CATEGORIES, STORAGE_KEY_TODOS } from '@/constants/StorageKeys';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY_TODOS);
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEY_CATEGORIES);

      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
      
        await AsyncStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        setCategories(DEFAULT_CATEGORIES);
      }

      setLoading(false);
    } catch (e) {
      console.error('Error loading data:', e);
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(newTodos));
    } catch (e) {
      console.error('Error saving todos:', e);
    }
  };

  const addTodo = async (): Promise<void> => {
    if (newTodo.trim() === '' || newTodo.length > 100) {
      Alert.alert('Error', 'La tarea debe tener entre 1 y 100 caracteres');
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Seleccione al menos una categoría');
      return;
    }

    try {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        categories: selectedCategories.length > 0 ? [...selectedCategories] : ['personal'],
      };

      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);

      setNewTodo('');
      Keyboard.dismiss();
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la tarea');
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      await saveTodos(updatedTodos);
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedTodos = todos.filter(todo => todo.id !== id);
              setTodos(updatedTodos);
              await saveTodos(updatedTodos);
            } catch (e) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

  const toggleCategoryFilter = (categoryId: string) => {
    setActiveFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
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

  const filteredTodos = showFilters && activeFilters.length > 0
    ? todos.filter(todo => 
        todo.categories.some(cat => activeFilters.includes(cat))
      )
    : todos;

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => deleteTodo(id)}
      >
        <Icon name="delete" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => {
    const todoCategories = categories.filter(cat => item.categories.includes(cat.id));

    return (
      <ScaleDecorator>
        <Swipeable
          renderRightActions={() => renderRightActions(item.id)}
          rightThreshold={40}
        >
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.todoItem,
              { backgroundColor: isActive ? '#F0F0F0' : '#FFFFFF' }
            ]}
          >
            <View style={styles.todoContent}>
              <View style={styles.todoMiddleSection}>
                <View style={styles.checkTextSection}>
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
                </View>
                <View style={styles.categoryContainer}>
                  {todoCategories.map(category => (
                    <View
                      key={category.id}
                      style={[
                        styles.categoryTag,
                        { backgroundColor: category.color + '20' }
                      ]}
                    >
                      <Text style={[styles.categoryText, { color: category.color }]}>
                        {category.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mis Tareas</Text>
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)}
              style={styles.filterButton}
            >
              <Icon 
                name={showFilters ? "filter-list" : "filter-alt"} 
                size={24} 
                color="#1a1a1a" 
              />
            </TouchableOpacity>
          </View>
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
                (newTodo.trim() === '' || selectedCategories.length === 0) ? styles.addButtonDisabled : styles.addButtonEnabled
              ]}
              onPress={addTodo}
              disabled={newTodo.trim() === ''}
            >
              <Icon name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
        
          <View style={styles.categorySelectorContainer}>
            <Text style={styles.categoryLabel}>Asignar a categoría:</Text>
            <View style={styles.categorySelectors}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categorySelector,
                    { borderColor: category.color },
                    selectedCategories.includes(category.id) && { backgroundColor: category.color + '20' }
                  ]}
                  onPress={() => toggleCategorySelection(category.id)}
                >
                  <Icon
                    name={selectedCategories.includes(category.id) ? "check-circle" : "circle"}
                    size={18}
                    color={category.color}
                    style={styles.categorySelectorIcon}
                  />
                  <Text style={[styles.categorySelectorText, { color: category.color }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        
          {showFilters && (
            <View style={styles.categoryFilterContainer}>
              <Text style={styles.categoryLabel}>Filtrar por categoría:</Text>
              <View style={styles.categoryFilters}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryFilter,
                      { borderColor: category.color },
                      activeFilters.includes(category.id) && { backgroundColor: category.color + '20' }
                    ]}
                    onPress={() => toggleCategoryFilter(category.id)}
                  >
                    <Icon
                      name={activeFilters.includes(category.id) ? "filter-list" : "filter-list-off"}
                      size={18}
                      color={category.color}
                      style={styles.categoryFilterIcon}
                    />
                    <Text style={[styles.categoryFilterText, { color: category.color }]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <DraggableFlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onDragEnd={({ data }) => {

            const updatedTodos = [...todos];
            

            data.forEach((filteredItem, index) => {

              const originalIndex = updatedTodos.findIndex(t => t.id === filteredItem.id);

              if (originalIndex !== -1) {
                updatedTodos[originalIndex] = filteredItem;
              }
            });
            
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
          }}
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filterButton: {
    padding: 5,
  },
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
  categorySelectorContainer: {
    marginBottom: 10,
  },
  categoryFilterContainer: {
    marginTop: 5,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  categorySelectors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categorySelectorIcon: {
    marginRight: 5,
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryFilterIcon: {
    marginRight: 5,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
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
    marginBottom: 10,
    alignSelf: 'flex-start',
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
  todoMiddleSection: {
    flex: 1,
  },
  checkTextSection: {
    flex: 1,
    flexDirection: 'row',
    gap: normalize(10),
  },
  todoText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  deleteAction: {
    backgroundColor: '#CC2F26',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '90%',
    borderRadius: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default App;