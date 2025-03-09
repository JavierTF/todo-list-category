import { Category } from '../types/common.type';
import { DEFAULT_CATEGORIES } from '../constants/DefaultCategories';
import { STORAGE_KEY_CATEGORIES } from '../constants/StorageKeys';
import { StorageService } from './storageService';

export const CategoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await StorageService.getData<Category[]>(STORAGE_KEY_CATEGORIES);
      if (!categories) {
        await StorageService.saveData(STORAGE_KEY_CATEGORIES, DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return categories;
    } catch (e) {
      console.error('Error loading categories:', e);
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories: async (categories: Category[]): Promise<void> => {
    try {
      await StorageService.saveData(STORAGE_KEY_CATEGORIES, categories);
    } catch (e) {
      console.error('Error saving categories:', e);
      throw new Error('Error saving categories');
    }
  }
};