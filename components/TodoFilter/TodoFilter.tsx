import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Category } from '../../types/common.type';

interface TodoFilterProps {
  categories: Category[];
  activeFilters: string[];
  onToggleFilter: (categoryId: string) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  categories,
  activeFilters,
  onToggleFilter
}) => {
  return (
    <View style={styles.categoryFilterContainer}>
      <Text style={styles.categoryLabel}>Filtrar por categoría:</Text>
      <View style={styles.categoryFilters}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryFilter,
              { borderColor: category.color },
              activeFilters.includes(category.id) && { backgroundColor: category.color + '20' }
            ]}
            onPress={() => onToggleFilter(category.id)}
          >
            <Icon
              name={activeFilters.includes(category.id) ? "filter-list" : "filter-list-off"}
              size={18}
              color={category.color}
              style={styles.categoryFilterIcon}
            />
            <Text style={[styles.categoryFilterText, { color: category.color }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryFilterContainer: {
    marginTop: 5,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryFilterIcon: {
    marginRight: 5,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});