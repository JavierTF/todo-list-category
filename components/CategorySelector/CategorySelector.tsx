import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Category } from '../../types/common.type';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  label?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onToggleCategory,
  label = 'Asignar a categoría:'
}) => {
  return (
    <View style={styles.categorySelectorContainer}>
      <Text style={styles.categoryLabel}>{label}</Text>
      <View style={styles.categorySelectors}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categorySelector,
              { borderColor: category.color },
              selectedCategories.includes(category.id) && { backgroundColor: category.color + '20' }
            ]}
            onPress={() => onToggleCategory(category.id)}
          >
            <Icon
              name={selectedCategories.includes(category.id) ? "check-circle" : "circle"}
              size={18}
              color={category.color}
              style={styles.categorySelectorIcon}
            />
            <Text style={[styles.categorySelectorText, { color: category.color }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySelectorContainer: {
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  categorySelectors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categorySelectorIcon: {
    marginRight: 5,
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
