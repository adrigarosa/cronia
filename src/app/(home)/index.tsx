import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../../hooks';
import { RecordItem } from '../../components/RecordItem';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, loading, error, refreshTasks, completeExistingTask } = useTasks();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshTasks();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const handleRecordPress = (id: string) => {
    router.push(`/(home)/${id}`);
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await completeExistingTask(id);
    } catch (err) {
      console.error('Error completando tarea:', err);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return b.created_at - a.created_at;
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cronologia</Text>
        <Text style={styles.subtitle}>
          {tasks.length} registros
        </Text>
      </View>

      {tasks.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Sin registros"
          description="Crea tu primer registro para comenzar a organizar."
        />
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecordItem
              record={item}
              onPress={handleRecordPress}
              onComplete={handleCompleteTask}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
