import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTasks, useCategories, useSearch } from '../hooks';
import { RecordItem } from '../components/RecordItem';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

export default function SearchScreen() {
  const { tasks, loading } = useTasks();
  const { categories } = useCategories();
  const { query, filters, setQuery, setFilters, resetFilters, filteredTasks } = useSearch(tasks);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Completado', value: 'completed' },
  ];

  const handleStatusToggle = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
      setFilters({ status: undefined });
    } else {
      setSelectedStatus(status);
      setFilters({ status: status as any });
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setFilters({ categoryId: undefined });
    } else {
      setSelectedCategory(categoryId);
      setFilters({ categoryId });
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
      </View>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color={colors.light.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Buscar tareas, notas, eventos..."
          placeholderTextColor={colors.light.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
        {query !== '' && (
          <Pressable onPress={() => setQuery('')}>
            <FontAwesome name="times" size={20} color={colors.light.textSecondary} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterButton}>
        <Pressable
          style={[styles.filterButtonInner, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <FontAwesome name="filter" size={18} color={colors.light.text} />
          <Text style={styles.filterButtonText}>Filtros</Text>
        </Pressable>

        {Object.values(filters).some((v) => v !== undefined && v !== '') && (
          <Pressable
            style={styles.clearButtonInner}
            onPress={() => {
              resetFilters();
              setSelectedStatus(null);
              setSelectedCategory(null);
            }}
          >
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </Pressable>
        )}
      </View>

      {showFilters && (
        <ScrollView style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Estado</Text>
            <View style={styles.filterOptions}>
              {statusOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.filterOption,
                    selectedStatus === option.value && styles.filterOptionActive,
                  ]}
                  onPress={() => handleStatusToggle(option.value)}
                >
                  <FontAwesome
                    name={selectedStatus === option.value ? 'check-square' : 'square-o'}
                    size={18}
                    color={colors.light.primary}
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === option.value && styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {categories.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categoria</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.filterOption,
                      selectedCategory === category.id && styles.filterOptionActive,
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                  >
                    <FontAwesome
                      name={selectedCategory === category.id ? 'check-square' : 'square-o'}
                      size={18}
                      color={colors.light.primary}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedCategory === category.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="inbox"
          title={query ? 'Sin resultados' : 'Sin registros'}
          description={
            query
              ? 'No encontramos registros que coincidan con tu búsqueda'
              : 'Crea tu primer registro para comenzar'
          }
        />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecordItem record={item} />}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            query || Object.values(filters).some((v) => v !== undefined && v !== '') ? (
              <Text style={styles.resultCount}>
                {filteredTasks.length} resultado{filteredTasks.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderColor: colors.light.border,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.light.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    borderColor: colors.light.border,
    borderWidth: 1,
    gap: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.light.primary + '10',
    borderColor: colors.light.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  clearButtonInner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.light.primary,
    fontWeight: '600',
  },
  filtersContainer: {
    maxHeight: 250,
    borderTopColor: colors.light.border,
    borderTopWidth: 1,
  },
  filtersContent: {
    padding: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOptions: {
    gap: spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  filterOptionActive: {
    backgroundColor: colors.light.primary + '08',
    paddingHorizontal: spacing.md,
    borderRadius: 6,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.light.text,
  },
  filterOptionTextActive: {
    fontWeight: '600',
    color: colors.light.primary,
  },
  resultCount: {
    fontSize: 12,
    color: colors.light.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
