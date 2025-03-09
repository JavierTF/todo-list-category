import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Todo, Category } from '../../types/common.type';
import { CategoryTag } from '../CategorySelector';
import { normalize } from '../../utils/normalize';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onLongPress: () => void;
  isActive: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  categories,
  onToggle,
  onDelete,
  onLongPress,
  isActive
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const todoCategories = categories.filter(cat => todo.categories.includes(cat.id));

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          if (swipeableRef.current) {
            swipeableRef.current.close();
          }
          onDelete(todo.id);
        }}
      >
        <Icon name="delete" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <TouchableOpacity
        onLongPress={onLongPress}
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
                onPress={() => onToggle(todo.id)}
              >
                <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
                  {todo.completed && (
                    <Icon name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
              </TouchableOpacity>
              <Text
                style={[
                  styles.todoText,
                  todo.completed && styles.todoTextCompleted
                ]}
              >
                {todo.text}
              </Text>
            </View>
            <View style={styles.categoryContainer}>
              {todoCategories.map(category => (
                <CategoryTag key={category.id} category={category} />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
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
});