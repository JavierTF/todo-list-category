import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { TodoList } from '../../components/TodoList';
import { TodoInput } from '../../components/TodoInput';
import { TodoFilter } from '../../components/TodoFilter';
import { CustomAlert } from '../../components/CustomAlert/CustomAlert';

import { useCategories } from '../../hooks/useCategories';
import { useTodos } from '../../hooks/useTodos';

const Home: React.FC = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { 
    todos, 
    loading: todosLoading, 
    addTodo, 
    toggleTodo, 
    confirmDeleteTodo,
    reorderTodos,
    alertVisible,
    alertTitle,
    alertMessage,
    closeAlert,
    handleConfirm,
    showCancelButton
  } = useTodos();
  
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  const toggleCategoryFilter = (categoryId: string) => {
    setActiveFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  if (categoriesLoading || todosLoading) {
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
          
          <TodoInput 
            categories={categories}
            onAddTodo={addTodo}
          />
          
          {showFilters && (
            <TodoFilter
              categories={categories}
              activeFilters={activeFilters}
              onToggleFilter={toggleCategoryFilter}
            />
          )}
        </View>

        <TodoList 
          todos={todos}
          categories={categories}
          activeFilters={activeFilters}
          onToggleTodo={toggleTodo}
          onDeleteTodo={confirmDeleteTodo}
          onReorderTodos={reorderTodos}
        />
        
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={closeAlert}
          onConfirm={handleConfirm}
          showCancelButton={showCancelButton}
          confirmText={showCancelButton ? "Eliminar" : "Aceptar"}
          cancelText="Cancelar"
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
    alignItems: 'flex-end',
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
});

export default Home;