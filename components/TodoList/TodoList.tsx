import React from 'react';
import { StyleSheet } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams
} from 'react-native-draggable-flatlist';
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

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => {
    return (
      <ScaleDecorator>
        <TodoItem
          todo={item}
          categories={categories}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onLongPress={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={filteredTodos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      onDragEnd={({ data }) => {
        const updatedTodos = [...todos];
        
        data.forEach((filteredItem) => {
          const originalIndex = updatedTodos.findIndex(t => t.id === filteredItem.id);
          if (originalIndex !== -1) {
            updatedTodos[originalIndex] = filteredItem;
          }
        });
        
        onReorderTodos(updatedTodos);
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
  },
});