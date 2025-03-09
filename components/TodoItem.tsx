import React, { memo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TodoItem = memo(({ 
  item, 
  drag, 
  isActive, 
  onToggle, 
  onDelete,
  styles // Pasamos los estilos como prop
}) => {
  const handleToggle = () => onToggle(item.id);
  const handleDelete = () => onDelete(item.id);

  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.todoItem,
          { backgroundColor: isActive ? '#F0F0F0' : '#FFFFFF' }
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Tarea: ${item.text}`}
        accessibilityHint="Mantén presionado para reordenar"
      >
        <View style={styles.todoContent}>
          <TouchableOpacity
            style={styles.todoCheckbox}
            onPress={handleToggle}
            accessibilityRole="checkbox"
            accessibilityLabel={item.completed ? "Marcar como incompleta" : "Marcar como completada"}
            accessibilityState={{ checked: item.completed }}
          >
            <View style={[
              styles.checkbox, 
              item.completed && styles.checkboxChecked
            ]}>
              {item.completed && (
                <Icon 
                  name="check" 
                  size={16} 
                  color="#FFFFFF"
                  accessibilityLabel="Tarea completada" 
                />
              )}
            </View>
          </TouchableOpacity>

          <Text
            style={[
              styles.todoText,
              item.completed && styles.todoTextCompleted
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.text}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Eliminar tarea"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon 
              name="delete" 
              size={20} 
              color="#CC2F26"
              accessibilityLabel="Ícono de eliminar" 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;