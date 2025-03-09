import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  saveData: async <T>(key: string, data: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving data for key ${key}:`, e);
      throw new Error(`Error saving data for key ${key}`);
    }
  },

  getData: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error(`Error retrieving data for key ${key}:`, e);
      throw new Error(`Error retrieving data for key ${key}`);
    }
  },

  removeData: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing data for key ${key}:`, e);
      throw new Error(`Error removing data for key ${key}`);
    }
  }
};