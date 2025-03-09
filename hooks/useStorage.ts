import { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';

export function useStorage<T>(key: string, initialValue: T): [T, (value: T) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await StorageService.getData<T>(key);
        if (value) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error(`Error reading from storage: ${key}`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  const setValue = async (value: T): Promise<void> => {
    try {
      setStoredValue(value);
      await StorageService.saveData(key, value);
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      throw error;
    }
  };

  return [storedValue, setValue];
}