import { useState, useEffect } from 'react';
import { Todo } from '../types/common.type';
import { STORAGE_KEY_TODOS } from '../constants/StorageKeys';
import { StorageService } from '../services/storageService';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [showCancelButton, setShowCancelButton] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setConfirmCallback(null);
    setShowCancelButton(false);
    setAlertVisible(true);
  };

  const showConfirmAlert = (title: string, message: string, onConfirm: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setConfirmCallback(() => onConfirm);
    setShowCancelButton(true);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
    setAlertVisible(false);
  };

  const loadTodos = async (): Promise<void> => {
    try {
      const storedTodos = await StorageService.getData<Todo[]>(STORAGE_KEY_TODOS);
      setTodos(storedTodos || []);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]): Promise<void> => {
    try {
      await StorageService.saveData(STORAGE_KEY_TODOS, newTodos);
      setTodos(newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
      throw error;
    }
  };

  const addTodo = async (text: string, categories: string[]): Promise<void> => {
    if (text.trim() === '' || text.length > 100) {
      showAlert('Error', 'La tarea debe tener entre 1 y 100 caracteres');
      return;
    }
    if (categories.length === 0) {
      showAlert('Error', 'Seleccione al menos una categoría');
      return;
    }

    try {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        categories: [...categories],
      };

      const updatedTodos = [...todos, newTodoItem];
      await saveTodos(updatedTodos);
    } catch (error) {
      showAlert('Error', 'No se pudo crear la tarea');
      throw error;
    }
  };

  const toggleTodo = async (id: string): Promise<void> => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      await saveTodos(updatedTodos);
    } catch (error) {
      showAlert('Error', 'No se pudo actualizar la tarea');
      throw error;
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      await saveTodos(updatedTodos);
    } catch (error) {
      showAlert('Error', 'No se pudo eliminar la tarea');
      throw error;
    }
  };

  const confirmDeleteTodo = (id: string): void => {
    showConfirmAlert(
      'Eliminar tarea',
      '¿Estás seguro que deseas eliminar esta tarea?',
      () => deleteTodo(id)
    );
  };

  const reorderTodos = async (reorderedTodos: Todo[]): Promise<void> => {
    try {
      await saveTodos(reorderedTodos);
    } catch (error) {
      showAlert('Error', 'No se pudo reordenar las tareas');
      throw error;
    }
  };

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    confirmDeleteTodo,
    reorderTodos,
    alertVisible,
    alertTitle,
    alertMessage,
    closeAlert,
    handleConfirm,
    showCancelButton
  };
};