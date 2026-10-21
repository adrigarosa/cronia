import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTimeline } from '../../hooks';
import { TimelineCard } from '../../components/TimelineCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { TimelineItem } from '../../utils/timeline';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export default function HomeScreen() {
  const router = useRouter();
  const { items, loading, error, refresh, complete, remove } = useTimeline();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handlePress = (item: TimelineItem) => {
    if (item.kind === 'task') {
      router.push({ pathname: '/(home)/[id]', params: { id: item.id } });
    }
  };

  const handleComplete = async (item: TimelineItem) => {
    try {
      await complete(item.id);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  const handleLongPress = (item: TimelineItem) => {
    Alert.alert('Eliminar', 'Quieres eliminar "' + item.title + '"?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(item.kind, item.id);
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        },
      },
    ]);
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cronología</Text>
        <Text style={styles.subtitle}>{items.length} registros</Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Sin registros"
          description="Crea tu primer registro para comenzar a organizar."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.kind + item.id}
          renderItem={({ item }) => (
            <TimelineCard
              item={item}
              onPress={handlePress}
              onLongPress={handleLongPress}
              onComplete={handleComplete}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
