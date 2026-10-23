import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecords } from '../../hooks/useRecords';
import { useAppearance } from '../../theme/AppearanceContext';
import { fonts, palette, RecordKind, TypeColors } from '../../theme/tokens';
import { startOfDay, weekdayIndex, recordsOnDay, RecordView } from '../../domain/records';
import {
  LogoMark,
  GearIcon,
  PlusIcon,
  TaskStateIcon,
  EventStateIcon,
  NoteStateIcon,
  HabitIcon,
} from '../../components/icons';

const WEEKDAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTHS_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const CHIP_DEFS: [RecordKind | 'all', string][] = [
  ['all', 'Todo'],
  ['T', 'Tareas'],
  ['E', 'Citas'],
  ['N', 'Notas'],
  ['H', 'Hábitos'],
];

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

function isClosed(r: RecordView): boolean {
  if (r.kind === 'T' || r.kind === 'E') return r.statusIndex >= 2;
  if (r.kind === 'H') return r.statusIndex >= 1;
  return false;
}

function isStruck(r: RecordView): boolean {
  return (r.kind === 'T' || r.kind === 'E') && r.statusIndex === 3;
}

function formatLongDate(ts: number): string {
  const d = new Date(ts);
  const wd = WEEKDAYS_LONG[d.getDay()];
  return wd.charAt(0).toUpperCase() + wd.slice(1) + ', ' + d.getDate() + ' de ' + MONTHS_LONG[d.getMonth()] + ' de ' + d.getFullYear();
}

export default function CronologiaScreen() {
  const { source, categories, cycleStatus, remove } = useRecords();
  const { colors } = useAppearance();
  const [now] = useState(() => Date.now());
  const [selected, setSelected] = useState(() => startOfDay(Date.now()));
  const [kindFilter, setKindFilter] = useState<RecordKind | 'all'>('all');
  const { date } = useLocalSearchParams<{ date?: string }>();

  useEffect(() => {
    if (date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(startOfDay(Number(date)));
    }
  }, [date]);

  const all = useMemo(() => recordsOnDay(source, selected, now), [source, selected, now]);
  const visible = kindFilter === 'all' ? all : all.filter((r) => r.kind === kindFilter);
  const closed = visible.filter(isClosed).length;

  const names = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categories) map[c.id] = c.name;
    return map;
  }, [categories]);

  const week = useMemo(() => {
    const today = startOfDay(now);
    const offset = weekdayIndex(today);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offset + i);
      return startOfDay(d.getTime());
    });
  }, [now]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length, T: 0, E: 0, N: 0, H: 0 };
    for (const r of all) c[r.kind]++;
    return c;
  }, [all]);

  const confirmDelete = (r: RecordView) => {
    Alert.alert(
      'Eliminar registro',
      '¿Eliminar «' + r.title + '»? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => remove(r.kind, r.id) },
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
        <View style={styles.brandRow}>
          <View style={styles.brand}>
            <LogoMark size={40} />
            <Text style={styles.brandText}>CRONIA</Text>
          </View>
          <Pressable
            style={styles.gearBtn}
            accessibilityLabel="Ajustes: categorías y apariencia"
            onPress={() => router.push('/settings')}
          >
            <GearIcon size={20} color={palette.ink} />
          </Pressable>
        </View>

        <Text style={styles.dateTitle}>{formatLongDate(selected)}</Text>

        <View style={styles.weekRow}>
          {week.map((ts, i) => {
            const sel = ts === selected;
            const future = ts > startOfDay(now);
            return (
              <Pressable
                key={ts}
                style={[styles.dayBtn, sel && styles.dayBtnOn]}
                onPress={() => setSelected(ts)}
              >
                <Text style={[styles.dayLetter, { color: sel ? palette.white : palette.inkSoft }]}>
                  {DAY_LETTERS[i]}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    { color: sel ? palette.white : future ? palette.inkSoft : palette.ink },
                  ]}
                >
                  {new Date(ts).getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chipsRow}>
          {CHIP_DEFS.map(([id, label]) => {
            const on = kindFilter === id;
            const tint = id === 'all' ? palette.muted : colors[id as RecordKind].tint;
            const dark = id === 'all' ? palette.inkSoft : colors[id as RecordKind].dark;
            return (
              <Pressable
                key={id}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => setKindFilter(id)}
              >
                <Text style={[styles.chipLabel, { color: on ? palette.white : palette.ink }]}>
                  {label}
                </Text>
                <Text
                  style={[
                    styles.chipCount,
                    {
                      backgroundColor: on ? 'rgba(255,255,255,0.18)' : tint,
                      color: on ? palette.white : dark,
                    },
                  ]}
                >
                  {counts[id]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.shownText}>{visible.length} registros</Text>
        <Text style={styles.closedText}>{closed} cerrados · toca el icono para cambiar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listScroll}>
        <View style={styles.card}>
          {visible.length === 0 && (
            <Text style={styles.empty}>No hay registros de este tipo hoy.</Text>
          )}
          {visible.map((r, i) => {
            const t = tileColors(r.kind, r.statusIndex, colors);
            const canCycle = r.kind !== 'N';
            const catNames = r.categoryIds.map((id) => names[id]).filter(Boolean);
            return (
              <Pressable
                key={r.kind + r.id + r.dateKey}
                style={[styles.row, i < visible.length - 1 && styles.rowDivider]}
                onPress={() => {
                  if (r.kind === 'T' || r.kind === 'H' || r.kind === 'E' || r.kind === 'N') {
                    router.push({ pathname: '/[id]', params: { id: r.id, kind: r.kind } });
                  }
                }}
                onLongPress={() => showActions(r)}
              >
                <View style={styles.tileWrap}>
                  <View
                    style={[
                      styles.tile,
                      { backgroundColor: t.bg },
                      t.ring && { borderWidth: 3, borderColor: colors.E.ring },
                      t.dashed && { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.H.dashed },
                    ]}
                  >
                    {r.kind === 'T' && <TaskStateIcon state={r.statusIndex} size={25} color={t.fg} />}
                    {r.kind === 'E' && <EventStateIcon state={r.statusIndex} size={23} color={t.fg} />}
                    {r.kind === 'N' && <NoteStateIcon state={r.statusIndex} size={23} color={t.fg} />}
                    {r.kind === 'H' && <HabitIcon size={23} color={t.fg} />}
                  </View>
                  {canCycle && (
                    <Pressable
                      style={styles.cycleBtn}
                      accessibilityLabel={'Cambiar estado de «' + r.title + '»'}
                      onPress={() => cycleStatus(r)}
                    />
                  )}
                </View>
                <View style={styles.rowBody}>
                  <Text
                    numberOfLines={2}
                    style={[styles.title, isStruck(r) && styles.titleStruck]}
                  >
                    {r.title}
                  </Text>
                  {catNames.length > 0 && (
                    <View style={styles.cats}>
                      {catNames.map((name) => (
                        <Text key={name} style={styles.cat}>
                          {name}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        accessibilityLabel="Crear registro"
        onPress={() => router.push('/create')}
      >
        <PlusIcon size={26} color={palette.white} strokeWidth={2.4} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  header: { padding: 20, paddingBottom: 8, gap: 14 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { fontFamily: fonts.display, fontSize: 15, letterSpacing: 2.1, color: palette.ink },
  gearBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderLogo,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTitle: { fontFamily: fonts.semibold, fontSize: 15, color: palette.ink },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  dayLetter: { fontSize: 10, fontFamily: fonts.semibold, lineHeight: 12 },
  dayNumber: { fontSize: 13, fontFamily: fonts.bold, lineHeight: 16 },
  chipsRow: { flexDirection: 'row', gap: 6 },
  chip: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.borderChip,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  chipOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  chipLabel: { fontSize: 9, fontFamily: fonts.semibold },
  chipCount: { fontSize: 8, fontFamily: fonts.bold, paddingHorizontal: 3, paddingVertical: 1, borderRadius: 6, overflow: 'hidden' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  shownText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  closedText: { fontSize: 12, color: palette.inkSoft },
  listScroll: { paddingHorizontal: 16, paddingBottom: 74 },
  card: {
    backgroundColor: palette.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 10, paddingLeft: 14, paddingRight: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: palette.divider },
  tileWrap: { width: 38, height: 38, marginTop: 1 },
  tile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleBtn: { position: 'absolute', top: -3, left: -3, width: 44, height: 44, borderRadius: 14 },
  rowBody: { flex: 1, minWidth: 0, gap: 1 },
  title: { fontSize: 15, fontFamily: fonts.semibold, lineHeight: 19 },
  titleStruck: { textDecorationLine: 'line-through', color: palette.inkSoft },
  cats: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginTop: 3 },
  cat: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fonts.semibold,
    color: palette.inkSoft,
    backgroundColor: palette.muted,
    borderRadius: 5,
    paddingHorizontal: 6,
  },
  empty: { padding: 40, paddingHorizontal: 24, textAlign: 'center', color: palette.inkSoft, fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C1B29',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
