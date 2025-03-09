import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Todo, Category } from '../../types/common.type';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  activeFilters: string[];
  onToggleTodo: (id: string) => Promise<void>;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (todos: Todo[]) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  categories,
  activeFilters,
  onToggleTodo,
  onDeleteTodo,
  onReorderTodos
}) => {
  const filteredTodos = activeFilters.length > 0
    ? todos.filter(todo => 
        todo.categories.some(cat => activeFilters.includes(cat))
      )
    : todos;

  const renderItem = ({ item }: { item: Todo }) => {
    return (
      <TodoItem
        todo={item}
        categories={categories}
        onToggle={onToggleTodo}
        onDelete={onDeleteTodo}
        onLongPress={() => {}}
        isActive={false}
      />
    );
  };

  return (
    <FlatList
      data={filteredTodos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      style={styles.list}
      showsVerticalScrollIndicator={true}
      bounces={true}
      overScrollMode="always"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
});