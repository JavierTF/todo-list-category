import { useState, useEffect } from 'react';
import { Category } from '../types/common.type';
import { STORAGE_KEY_CATEGORIES } from '../constants/StorageKeys';
import { CategoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await CategoryService.getCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading categories in hook:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const saveCategories = async (newCategories: Category[]): Promise<void> => {
    try {
      await CategoryService.saveCategories(newCategories);
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories in hook:', error);
      throw error;
    }
  };

  return {
    categories,
    loading,
    saveCategories
  };
};
