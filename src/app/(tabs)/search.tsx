import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRecords } from '../../hooks/useRecords';
import { useAppearance } from '../../theme/AppearanceContext';
import { Select, SelectOption } from '../../components/Select';
import { fonts, palette, LABELS, RecordKind, TypeColors } from '../../theme/tokens';
import {
  allRecordViews,
  filterRecords,
  startOfDay,
  MONTHS,
  RecordView,
} from '../../domain/records';
import {
  SearchIcon,
  NoResultsIcon,
  TaskStateIcon,
  EventStateIcon,
  NoteStateIcon,
  HabitIcon,
} from '../../components/icons';

const TYPE_OPTS: SelectOption[] = [
  { id: 'all', label: 'Todos' },
  { id: 'T', label: 'Tareas' },
  { id: 'E', label: 'Citas' },
  { id: 'N', label: 'Notas' },
  { id: 'H', label: 'Hábitos' },
];

const STATE_OPTS: Record<string, SelectOption[]> = {
  H: [
    { id: 'all', label: 'Ambos' },
    { id: 'done', label: 'Cumplidos' },
    { id: 'no', label: 'No cumplidos' },
  ],
  default: [
    { id: 'all', label: 'Todos' },
    { id: 'open', label: 'Abiertos' },
    { id: 'done', label: 'Culminados' },
    { id: 'no', label: 'Cancelados' },
  ],
};

const GRAY = { bg: '#EFEEF3', fg: '#5E5C70' };

function tileColors(kind: RecordKind, idx: number, colors: Record<RecordKind, TypeColors>) {
  switch (kind) {
    case 'T':
      return idx === 3 ? { ...GRAY, ring: false, dashed: false } : { bg: colors.T.tint, fg: colors.T.dark, ring: false, dashed: false };
    case 'E':
      if (idx === 0) return { bg: colors.E.tint, fg: colors.E.mid, ring: false, dashed: false };
      if (idx === 1) return { bg: colors.E.base, fg: palette.white, ring: true, dashed: false };
      if (idx === 2) return { bg: colors.E.dark, fg: palette.white, ring: false, dashed: false };
      return { ...GRAY, ring: false, dashed: false };
    case 'H':
      if (idx === 0) return { bg: colors.H.tint, fg: colors.H.mid, ring: false, dashed: true };
      if (idx === 1) return { bg: colors.H.dark, fg: palette.white, ring: false, dashed: false };
      return { ...GRAY, ring: false, dashed: false };
    case 'N':
      return { bg: colors.N.tint, fg: colors.N.dark, ring: false, dashed: false };
  }
}

function isStruck(r: RecordView): boolean {
  return r.kind !== 'H' && (r.kind === 'T' || r.kind === 'E') && r.statusIndex === 3;
}

function formatDateShort(ts: number): string {
  const d = new Date(ts);
  return (
    String(d.getDate()).padStart(2, '0') +
    '/' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '/' +
    d.getFullYear()
  );
}

export default function BuscarScreen() {
  const { source, categories, remove } = useRecords();
  const { colors } = useAppearance();
  const [now] = useState(() => Date.now());
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<RecordKind | 'all'>('all');
  const [categoryId, setCategoryId] = useState('all');
  const [state, setState] = useState('all');
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [picker, setPicker] = useState<{ field: 'from' | 'to'; value: Date } | null>(null);

  const records = useMemo(() => allRecordViews(source, now), [source, now]);

  const namesMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const cat of categories) m[cat.id] = cat.name;
    return m;
  }, [categories]);

  const results = useMemo(
    () =>
      filterRecords(records, {
        query,
        kind,
        categoryId,
        state: state as 'all' | 'open' | 'done' | 'no',
        from,
        to,
      }),
    [records, query, kind, categoryId, state, from, to]
  );

  const catOpts: SelectOption[] = [
    { id: 'all', label: 'Todas' },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];
  const stOpts = kind === 'H' ? STATE_OPTS.H : STATE_OPTS.default;

  const onPickerChange = (_e: unknown, selected?: Date) => {
    const current = picker;
    setPicker(null);
    if (!selected || !current) return;
    const ts = startOfDay(selected.getTime());
    if (current.field === 'from') setFrom(ts);
    else setTo(ts);
  };

  const reset = () => {
    setKind('all');
    setCategoryId('all');
    setState('all');
  };

  const confirmDelete = (r: RecordView) => {
    Alert.alert(
      'Eliminar registro',
      '¿Eliminar «' + r.title + '»? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => remove(r.kind, r.id),
        },
      ]
    );
  };

  const showActions = (r: RecordView) => {
    Alert.alert(r.title, undefined, [
      { text: 'Editar', onPress: () => router.push({ pathname: '/edit', params: { kind: r.kind, id: r.id } }) },
      { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(r) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.h1}>Buscar</Text>

        <View style={styles.searchWrap}>
          <View style={styles.searchIcon}>
            <SearchIcon size={20} color={palette.inkSoft} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Descripción o contenido…"
            placeholderTextColor={palette.inkSoft}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Buscar por descripción o contenido"
          />
        </View>

        <View style={styles.filters}>
          <View style={styles.filterCell}>
            <Text style={styles.filterLabel}>Tipo</Text>
            <Select
              value={kind}
              options={TYPE_OPTS}
              onChange={(id) => {
                setKind(id as RecordKind | 'all');
                setState('all');
              }}
            />
          </View>
          <View style={styles.filterCell}>
            <Text style={styles.filterLabel}>Categoría</Text>
            <Select value={categoryId} options={catOpts} onChange={setCategoryId} />
          </View>
          <View style={styles.filterCell}>
            <Text style={styles.filterLabel}>Estado</Text>
            <Select value={state} options={stOpts} onChange={setState} />
          </View>
          <View style={styles.filterCell}>
            <Text style={styles.filterLabel}>Desde</Text>
            <Pressable style={styles.dateField} onPress={() => setPicker({ field: 'from', value: new Date(from ?? Date.now()) })}>
              <Text style={[styles.dateText, !from && styles.placeholder]}>{from ? formatDateShort(from) : 'DD/MM/AAAA'}</Text>
            </Pressable>
          </View>
          <View style={styles.filterCell}>
            <Text style={styles.filterLabel}>Hasta</Text>
            <Pressable style={styles.dateField} onPress={() => setPicker({ field: 'to', value: new Date(to ?? Date.now()) })}>
              <Text style={[styles.dateText, !to && styles.placeholder]}>{to ? formatDateShort(to) : 'DD/MM/AAAA'}</Text>
            </Pressable>
          </View>
        </View>
        {picker && (
          <DateTimePicker
            value={picker.value}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onValueChange={onPickerChange}
            onDismiss={() => setPicker(null)}
          />
        )}
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {results.length === 1 ? '1 resultado' : results.length + ' resultados'}
        </Text>
        <Text style={styles.sortText}>Más recientes primero</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listScroll}>
        {results.length > 0 && (
          <View style={styles.card}>
            {results.map((r, i) => {
              const t = tileColors(r.kind, r.statusIndex, colors);
              const d = new Date(r.date);
              const catText = r.categoryIds.map((id) => namesMap[id]).filter(Boolean).join(', ');
              return (
                <Pressable
                  key={r.kind + r.id + r.dateKey}
                  style={[styles.row, i < results.length - 1 && styles.rowDivider]}
                  onPress={() => {
                    if (r.kind === 'T' || r.kind === 'H' || r.kind === 'E' || r.kind === 'N') {
                      router.push({ pathname: '/[id]', params: { id: r.id, kind: r.kind } });
                    }
                  }}
                  onLongPress={() => showActions(r)}
                >
                  <View style={styles.dateCol}>
                    <Text style={styles.dateDay}>{d.getDate()}</Text>
                    <Text style={styles.dateMon}>{MONTHS[d.getMonth()]}</Text>
                  </View>
                  <View style={[styles.tile, { backgroundColor: t.bg }]}>
                    {r.kind === 'T' && <TaskStateIcon state={r.statusIndex} size={30} color={t.fg} />}
                    {r.kind === 'E' && <EventStateIcon state={r.statusIndex} size={28} color={t.fg} />}
                    {r.kind === 'N' && <NoteStateIcon state={r.statusIndex} size={28} color={t.fg} />}
                    {r.kind === 'H' && <HabitIcon size={28} color={t.fg} />}
                  </View>
                  <View style={styles.rowBody}>
                    <Text numberOfLines={1} style={[styles.title, isStruck(r) && styles.titleStruck]}>
                      {r.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.meta}>
                      <Text style={{ color: colors[r.kind].dark, fontFamily: fonts.bold }}>
                        {LABELS[r.kind].label}
                      </Text>
                      {catText ? ' · ' + catText : ''}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {results.length === 0 && (
          <View style={styles.empty}>
            <NoResultsIcon size={40} color={palette.inkSoft} strokeWidth={1.6} />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptySub}>Prueba con otra palabra o quita algún filtro.</Text>
            <Pressable style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetText}>Quitar filtros</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  header: { padding: 20, paddingBottom: 10, gap: 12 },
  h1: { fontFamily: fonts.display, fontSize: 26, color: palette.ink, marginHorizontal: 4 },
  searchWrap: { justifyContent: 'center' },
  searchIcon: { position: 'absolute', left: 14, top: 15, zIndex: 1 },
  searchInput: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    paddingLeft: 44,
    paddingRight: 14,
    fontSize: 15,
    color: palette.ink,
    fontFamily: fonts.body,
  },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterCell: { flexBasis: '47%', flexGrow: 1, gap: 4 },
  filterLabel: { fontSize: 12, fontFamily: fonts.bold, color: palette.inkSoft },
  dateField: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateText: { fontSize: 14, fontFamily: fonts.semibold, color: palette.ink },
  placeholder: { color: palette.inkSoft },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  countText: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  sortText: { fontSize: 12, color: palette.inkSoft },
  listScroll: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: palette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 13, paddingLeft: 14, paddingRight: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: palette.divider },
  dateCol: { width: 34, alignItems: 'center', flexShrink: 0 },
  dateDay: { fontFamily: fonts.display, fontSize: 17, lineHeight: 19, color: palette.ink },
  dateMon: { fontSize: 11, color: palette.inkSoft },
  tile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBody: { flex: 1, minWidth: 0, gap: 3 },
  title: { fontSize: 15, fontFamily: fonts.semibold, lineHeight: 20 },
  titleStruck: { textDecorationLine: 'line-through', color: palette.inkSoft },
  meta: { fontSize: 12, color: palette.inkSoft },
  empty: { padding: 48, alignItems: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: fonts.bold, color: palette.ink },
  emptySub: { fontSize: 14, color: palette.inkSoft, lineHeight: 20, textAlign: 'center' },
  resetBtn: {
    marginTop: 6,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.ink,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { fontSize: 14, fontFamily: fonts.bold, color: palette.ink },
});
