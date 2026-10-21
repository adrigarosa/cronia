import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import {
  getCategories,
  createCategory,
  updateCategory,
  setCategoryArchived,
  getTasks,
  getNotes,
  getEvents,
  getHabits,
  getAllHabitLogs,
  getRecordCategoryMap,
  clearDatabase,
  transaction,
} from '../database';
import { countRecordsByCategory } from '../database/recordCategories';
import type { Category } from '../database/types';
import { generateId } from '../utils/id';
import { buildBackupJson, parseBackupJson, BackupFile } from '../utils/backup';
import { fonts, palette, COLOR_THEMES, ColorThemeId } from '../theme/tokens';
import { useAppearance, ColorMode } from '../theme/AppearanceContext';
import {
  ChevronLeftIcon,
  TagIcon,
  EditIcon,
  ArchiveIcon,
  DownloadIcon,
  UploadIcon,
  PlusIcon,
  CloseIcon,
} from '../components/icons';

const MODES: { id: ColorMode; label: string }[] = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
  { id: 'auto', label: 'Sistema' },
];

const PREVIEW_KINDS = ['Tarea', 'Cita', 'Nota', 'Hábito'] as const;

function countLabel(n: number): string {
  return n === 0 ? 'Sin registros' : n === 1 ? '1 registro' : n + ' registros';
}

export default function AjustesScreen() {
  const { themeId, setThemeId, mode, setMode, dark } = useAppearance();
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    const [cats, countsMap] = await Promise.all([getCategories(), countRecordsByCategory()]);
    setCategories(cats);
    setCounts(countsMap);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load])
  );

  const active = useMemo(() => categories.filter((c) => !c.archived), [categories]);
  const archived = useMemo(() => categories.filter((c) => c.archived), [categories]);

  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await createCategory(generateId(), name);
      setNewName('');
      await load();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  const saveEdit = async () => {
    const name = draft.trim();
    if (!name || !editing) return;
    try {
      await updateCategory(editing, name);
      setEditing(null);
      await load();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  const archive = async (cat: Category) => {
    await setCategoryArchived(cat.id, true);
    await load();
  };

  const restore = async (cat: Category) => {
    await setCategoryArchived(cat.id, false);
    await load();
  };

  const exportBackup = async () => {
    try {
      const [tasks, notes, events, habits, logs, categoryMap, cats] = await Promise.all([
        getTasks(),
        getNotes(),
        getEvents(),
        getHabits(),
        getAllHabitLogs(),
        getRecordCategoryMap(),
        getCategories(),
      ]);
      const json = buildBackupJson(
        { tasks, notes, events, habits, logs, categories: cats, categoryMap },
        Date.now()
      );
      const file = new File(Paths.cache, 'copia-cronia.json');
      file.create({ overwrite: true });
      file.write(json);
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('No se puede compartir', 'Este dispositivo no permite compartir archivos.');
        return;
      }
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportar copia de CRONIA',
      });
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  const applyBackup = async (data: BackupFile) => {
    await clearDatabase();
    const catIds = new Set(data.categories.map((c) => c.id));
    const stmts: { sql: string; params: (string | number | boolean)[] }[] = [];
    for (const c of data.categories) {
      stmts.push({
        sql: 'INSERT INTO categories (id, name, created_at, archived) VALUES (?, ?, ?, ?)',
        params: [c.id, c.name, c.created_at ?? Date.now(), c.archived ? 1 : 0],
      });
    }
    const all = [
      ...data.tasks.map((t) => ({ ...t, kind: 'task' })),
      ...data.notes.map((n) => ({ ...n, kind: 'note' })),
      ...data.events.map((e) => ({ ...e, kind: 'event' })),
      ...data.habits.map((h) => ({ ...h, kind: 'habit' })),
    ];
    for (const r of all) {
      stmts.push({
        sql: 'INSERT INTO records (id, type, created_at, updated_at, deleted) VALUES (?, ?, ?, ?, ?)',
        params: [r.id, r.kind, r.created_at ?? Date.now(), r.updated_at ?? Date.now(), r.deleted ? 1 : 0],
      });
    }
    for (const t of data.tasks) {
      stmts.push({
        sql: 'INSERT INTO tasks (id, description, due_date, status, completed_at) VALUES (?, ?, ?, ?, ?)',
        params: [t.id, t.description, t.due_date ?? null, t.status ?? 'pending', t.completed_at ?? null],
      });
    }
    for (const n of data.notes) {
      stmts.push({
        sql: 'INSERT INTO notes (id, content, classification) VALUES (?, ?, ?)',
        params: [n.id, n.content, n.classification ?? 'reminder'],
      });
    }
    for (const e of data.events) {
      stmts.push({
        sql: 'INSERT INTO events (id, description, start_date, start_time, end_date, end_time, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        params: [e.id, e.description, e.start_date, e.start_time, e.end_date, e.end_time, e.location ?? null, e.status ?? 'upcoming'],
      });
    }
    for (const h of data.habits) {
      stmts.push({
        sql: 'INSERT INTO habits (id, name, start_date, active, days) VALUES (?, ?, ?, ?, ?)',
        params: [h.id, h.name, h.start_date, h.active ? 1 : 0, h.days ?? '1111111'],
      });
    }
    for (const l of data.habitLogs) {
      stmts.push({
        sql: 'INSERT INTO habit_logs (id, habit_id, date, status, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        params: [l.id, l.habit_id, l.date, l.status ?? 'completed', l.note ?? null, l.created_at ?? Date.now(), l.updated_at ?? Date.now()],
      });
    }
    for (const [recordId, catsOfRecord] of Object.entries(data.categoryMap)) {
      for (const categoryId of catsOfRecord) {
        if (!catIds.has(categoryId)) continue;
        stmts.push({
          sql: 'INSERT OR IGNORE INTO record_categories (record_id, category_id) VALUES (?, ?)',
          params: [recordId, categoryId],
        });
      }
    }
    await transaction(stmts);
    await load();
  };

  const importBackup = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (res.canceled || !res.assets?.length) return;
      let data: BackupFile;
      try {
        data = parseBackupJson(new File(res.assets[0].uri).textSync());
      } catch (err) {
        Alert.alert('Copia no válida', (err as Error).message);
        return;
      }
      Alert.alert(
        'Restaurar copia',
        'Esta acción reemplaza todos los datos actuales por los de la copia. No se puede deshacer.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Restaurar',
            style: 'destructive',
            onPress: () => {
              applyBackup(data).catch((err) => Alert.alert('Error', (err as Error).message));
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          accessibilityLabel="Volver a la cronología"
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={22} color={palette.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.h1}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Categorías */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <Text style={styles.sectionHint}>{active.length} activas</Text>
          </View>

          <View style={styles.card}>
            {active.map((cat, i) => (
              <View
                key={cat.id}
                style={[styles.catRow, i < active.length - 1 && styles.divider]}
              >
                {editing === cat.id ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.editInput}
                      value={draft}
                      onChangeText={setDraft}
                      autoFocus
                      onSubmitEditing={saveEdit}
                      accessibilityLabel="Nuevo nombre de la categoría"
                    />
                    <Pressable style={styles.saveBtn} onPress={saveEdit}>
                      <Text style={styles.saveBtnText}>Guardar</Text>
                    </Pressable>
                    <Pressable
                      style={styles.cancelBtn}
                      accessibilityLabel="Cancelar edición"
                      onPress={() => setEditing(null)}
                    >
                      <CloseIcon size={16} color={palette.ink} strokeWidth={2.4} />
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.viewRow}>
                    <View style={styles.tagTile}>
                      <TagIcon size={17} color={palette.inkSoft} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text numberOfLines={1} style={styles.catName}>
                        {cat.name}
                      </Text>
                      <Text style={styles.catCount}>{countLabel(counts[cat.id] ?? 0)}</Text>
                    </View>
                    <Pressable
                      style={styles.iconBtn}
                      accessibilityLabel={'Renombrar ' + cat.name}
                      onPress={() => {
                        setEditing(cat.id);
                        setDraft(cat.name);
                      }}
                    >
                      <EditIcon size={18} color={palette.ink} />
                    </Pressable>
                    <Pressable
                      style={styles.iconBtn}
                      accessibilityLabel={'Archivar ' + cat.name}
                      onPress={() => archive(cat)}
                    >
                      <ArchiveIcon size={18} color={palette.inkSoft} />
                    </Pressable>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.addRow}>
              <TextInput
                style={styles.newInput}
                placeholder="Nueva categoría…"
                placeholderTextColor={palette.inkSoft}
                value={newName}
                onChangeText={setNewName}
                accessibilityLabel="Nombre de la nueva categoría"
              />
              <Pressable style={styles.addBtn} onPress={addCategory}>
                <PlusIcon size={14} color={palette.white} strokeWidth={2.8} />
                <Text style={styles.addBtnText}>Añadir</Text>
              </Pressable>
            </View>
          </View>

          {archived.length > 0 && (
            <View style={styles.card}>
              {archived.map((cat) => (
                <View key={cat.id} style={styles.archRow}>
                  <Text style={styles.archText}>
                    <Text style={styles.archName}>{cat.name}</Text> · archivada
                  </Text>
                  <Pressable style={styles.restoreBtn} onPress={() => restore(cat)}>
                    <Text style={styles.restoreBtnText}>Restaurar</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.note}>
            Archivar una categoría no borra ningún registro: los registros la conservan y deja de
            aparecer al crear nuevos.
          </Text>
        </View>

        {/* Apariencia */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginHorizontal: 4 }]}>Apariencia</Text>
          <View style={styles.cardPadded}>
            <View style={{ gap: 8 }}>
              <Text style={styles.fieldLabel}>Modo</Text>
              <View style={styles.modeTrack}>
                {MODES.map((m) => (
                  <Pressable
                    key={m.id}
                    style={[styles.modeBtn, mode === m.id && styles.modeBtnOn]}
                    onPress={() => setMode(m.id)}
                  >
                    <Text style={[styles.modeText, mode === m.id && styles.modeTextOn]}>
                      {m.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.fieldLabel}>Tema de colores</Text>
              <View style={styles.themesRow}>
                {COLOR_THEMES.map((t) => {
                  const on = themeId === t.id;
                  return (
                    <Pressable
                      key={t.id}
                      style={[styles.themeBtn, on && styles.themeBtnOn]}
                      onPress={() => setThemeId(t.id as ColorThemeId)}
                    >
                      <View style={styles.swatchGrid}>
                        {t.swatches.map((c) => (
                          <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
                        ))}
                      </View>
                      <Text style={styles.themeLabel}>{t.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ gap: 6 }}>
              <Text style={styles.fieldLabel}>Vista previa</Text>
              <View style={[styles.preview, dark && styles.previewDark]}>
                {PREVIEW_KINDS.map((label, i) => {
                  const color = COLOR_THEMES.find((t) => t.id === themeId)?.swatches[i];
                  return (
                    <View key={label} style={styles.previewItem}>
                      <View style={[styles.previewTile, { backgroundColor: color }]} />
                      <Text style={[styles.previewText, dark && styles.previewTextDark]}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Datos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginHorizontal: 4 }]}>Datos</Text>
          <View style={styles.card}>
            <Pressable style={[styles.dataRow, styles.divider]} onPress={exportBackup}>
              <DownloadIcon size={18} color={palette.ink} />
              <Text style={styles.dataText}>Exportar copia de seguridad</Text>
            </Pressable>
            <Pressable style={styles.dataRow} onPress={importBackup}>
              <UploadIcon size={18} color={palette.ink} />
              <Text style={styles.dataText}>Restaurar desde una copia</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>Tus datos se guardan solo en este dispositivo.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  header: {
    padding: 14,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  h1: { fontFamily: fonts.display, fontSize: 20, color: palette.ink },
  scroll: { padding: 16, paddingTop: 4, paddingBottom: 32, gap: 22 },
  section: { gap: 8 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: palette.inkSoft,
  },
  sectionHint: { fontSize: 12, color: palette.inkSoft },
  card: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardPadded: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  catRow: { minHeight: 56, padding: 6, paddingLeft: 12, paddingRight: 6, flexDirection: 'row', alignItems: 'center' },
  divider: { borderBottomWidth: 1, borderBottomColor: palette.divider },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  tagTile: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: palette.muted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catName: { fontSize: 15, fontFamily: fonts.semibold, color: palette.ink },
  catCount: { fontSize: 12, color: palette.inkSoft },
  iconBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  editInput: {
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.ink,
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    fontSize: 15,
    color: palette.ink,
    fontFamily: fonts.body,
  },
  saveBtn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { fontSize: 13, fontFamily: fonts.bold, color: palette.white },
  cancelBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderTopWidth: 1,
    borderTopColor: palette.divider,
    backgroundColor: '#FBFAFD',
  },
  newInput: {
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    paddingHorizontal: 12,
    fontSize: 14,
    color: palette.ink,
    fontFamily: fonts.body,
  },
  addBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: palette.ink,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: { fontSize: 13, fontFamily: fonts.bold, color: palette.white },
  archRow: { minHeight: 48, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  archText: { flex: 1, fontSize: 14, color: palette.inkSoft },
  archName: { fontFamily: fonts.semibold },
  restoreBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreBtnText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  note: { fontSize: 12, color: palette.inkSoft, lineHeight: 17, marginHorizontal: 4 },
  fieldLabel: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  modeTrack: {
    flexDirection: 'row',
    backgroundColor: palette.segmentTrack,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeBtn: { flex: 1, height: 38, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  modeBtnOn: {
    backgroundColor: palette.white,
    shadowColor: palette.ink,
    shadowOpacity: 0.14,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  modeText: { fontSize: 14, fontFamily: fonts.bold, color: palette.inkSoft },
  modeTextOn: { color: palette.ink },
  themesRow: { flexDirection: 'row', gap: 8 },
  themeBtn: {
    flex: 1,
    minHeight: 84,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  themeBtnOn: { backgroundColor: palette.bg, borderColor: palette.ink, borderWidth: 2 },
  swatchGrid: {
    width: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  swatch: { width: '47%', aspectRatio: 1, borderRadius: 5 },
  themeLabel: { fontSize: 12, fontFamily: fonts.bold, color: palette.ink },
  preview: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.bg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  previewDark: { backgroundColor: palette.ink, borderColor: palette.ink },
  previewItem: { flexGrow: 1, flexBasis: '45%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewTile: { width: 24, height: 24, borderRadius: 7, flexShrink: 0 },
  previewText: { fontSize: 14, fontFamily: fonts.semibold, color: palette.ink },
  previewTextDark: { color: palette.bg },
  dataRow: {
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dataText: { fontSize: 15, fontFamily: fonts.semibold, color: palette.ink },
});
