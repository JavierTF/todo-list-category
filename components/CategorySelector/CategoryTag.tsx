import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../../types/common.type';

interface CategoryTagProps {
  category: Category;
  small?: boolean;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category, small = false }) => {
  return (
    <View
      style={[
        styles.categoryTag,
        { backgroundColor: category.color + '20' },
        small && styles.smallTag
      ]}
    >
      <Text 
        style={[
          styles.categoryText, 
          { color: category.color },
          small && styles.smallText
        ]}
      >
        {category.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryTag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  smallTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  }
});