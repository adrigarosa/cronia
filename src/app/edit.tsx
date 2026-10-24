import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getTask,
  getNote,
  getEvent,
  getHabit,
  updateTask,
  updateNote,
  updateEvent,
  updateHabit,
  getCategories,
  getRecordCategoryMap,
  setRecordCategories,
} from '../database';
import type { Category } from '../database/types';
import { fonts, RecordKind, Palette } from '../theme/tokens';
import { usePalette } from '../theme/AppearanceContext';
import { startOfDay } from '../domain/records';
import { CloseIcon, CheckIcon } from '../components/icons';
import { LoadingSpinner } from '../components/LoadingSpinner';

const TITLES: Record<RecordKind, string> = {
  T: 'Editar tarea',
  N: 'Editar nota',
  E: 'Editar cita',
  H: 'Editar hábito',
};

const ACCENT: Record<RecordKind, { dark: string }> = {
  T: { dark: '#1F618D' },
  N: { dark: '#0E6655' },
  E: { dark: '#7D3C98' },
  H: { dark: '#A04000' },
};

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDateShort(ts: number): string {
  const d = new Date(ts);
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
}

function timeToVal(time: string | null): Date {
  const d = new Date();
  if (time) {
    const [h, m] = time.split(':').map(Number);
    d.setHours(h, m, 0, 0);
  } else {
    d.setHours(9, 0, 0, 0);
  }
  return d;
}

function valToTime(d: Date): string {
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

type PickerState = { field: string; mode: 'date' | 'time'; value: Date } | null;

export default function EditScreen() {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const { kind: kindParam, id } = useLocalSearchParams<{ kind: RecordKind; id: string }>();
  const kind = kindParam as RecordKind;

  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerState>(null);

  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [startDay, setStartDay] = useState<number>(() => startOfDay(Date.now()));
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<number>(() => startOfDay(Date.now()));
  const [endTime, setEndTime] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [habitActive, setHabitActive] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [all, map] = await Promise.all([getCategories(), getRecordCategoryMap()]);
      setCategories(all.filter((cat) => !cat.archived));
      setCats(map[id] ?? []);
      if (kind === 'T') {
        const t = await getTask(id);
        if (!t) return false;
        setDesc(t.description);
        setDueDate(t.due_date ?? null);
        return true;
      }
      if (kind === 'N') {
        const n = await getNote(id);
        if (!n) return false;
        setDesc(n.content);
        return true;
      }
      if (kind === 'E') {
        const e = await getEvent(id);
        if (!e) return false;
        setDesc(e.description);
        setStartDay(startOfDay(e.start_date));
        setStartTime(e.start_time);
        setEndDay(startOfDay(e.end_date));
        setEndTime(e.end_time);
        return true;
      }
      const h = await getHabit(id);
      if (!h) return false;
      setDesc(h.name);
      setStartDay(startOfDay(h.start_date));
      setHabitActive(!!h.active);
      return true;
    };

    load()
      .then((ok) => setFound(ok))
      .catch(() => setFound(false))
      .finally(() => setLoading(false));
  }, [kind, id]);

  const c = ACCENT[kind] ?? ACCENT.T;

  const fail = (message: string) => Alert.alert('Revisa el formulario', message);

  const handleSave = async () => {
    const text = desc.trim();
    if (!text) {
      return fail(kind === 'N' ? 'Escribe el contenido de la nota.' : 'Escribe una descripción.');
    }
    if (kind === 'E') {
      if (!startTime) return fail('Indica la hora de inicio.');
      if (!endTime) return fail('Indica la hora de fin.');
      if (endDay < startDay) return fail('El fin no puede ser anterior al inicio.');
      if (endDay === startDay && endTime < startTime) {
        return fail('La hora de fin no puede ser anterior a la de inicio.');
      }
    }

    try {
      setSaving(true);
      if (kind === 'T') {
        await updateTask(id, { description: text, due_date: dueDate });
      } else if (kind === 'N') {
        await updateNote(id, { content: text });
      } else if (kind === 'E') {
        await updateEvent(id, {
          description: text,
          start_date: startDay,
          start_time: startTime ?? undefined,
          end_date: endDay,
          end_time: endTime ?? undefined,
        });
      } else {
        await updateHabit(id, { name: text, start_date: startDay, active: habitActive });
      }
      await setRecordCategories(id, cats);
      router.back();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
      setSaving(false);
    }
  };

  const openPicker = (field: string, mode: 'date' | 'time', value: Date) =>
    setPicker({ field, mode, value });

  const onPickerChange = (_e: unknown, selected?: Date) => {
    const current = picker;
    setPicker(Platform.OS === 'ios' ? current : null);
    if (!selected || !current) return;
    if (current.mode === 'date') {
      const ts = startOfDay(selected.getTime());
      if (current.field === 'dueDate') setDueDate(ts);
      if (current.field === 'startDay') {
        setStartDay(ts);
        if (endDay < ts) setEndDay(ts);
      }
      if (current.field === 'endDay') setEndDay(ts);
    } else {
      const time = valToTime(selected);
      if (current.field === 'startTime') setStartTime(time);
      if (current.field === 'endTime') setEndTime(time);
    }
  };

  const pickerNode = picker && (
    <DateTimePicker
      value={picker.value}
      mode={picker.mode}
      display={Platform.OS === 'ios' ? 'inline' : 'default'}
      onValueChange={onPickerChange}
      onDismiss={() => setPicker(null)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!found) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.closeBtn} accessibilityLabel="Cerrar" onPress={() => router.back()}>
            <CloseIcon size={22} color={palette.ink} strokeWidth={2.2} />
          </Pressable>
          <Text style={styles.headerTitle}>Editar</Text>
          <View style={{ width: 48 }} />
        </View>
        <Text style={styles.notFound}>Registro no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.closeBtn} accessibilityLabel="Cerrar sin guardar" onPress={() => router.back()}>
          <CloseIcon size={22} color={palette.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>{TITLES[kind]}</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {kind === 'T' && (
            <>
              <Field label="Descripción">
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />
              </Field>
              <Field label="Fecha límite" hint="(opcional)">
                <View style={styles.row}>
                  <Pressable
                    style={[styles.input, styles.flex]}
                    onPress={() => openPicker('dueDate', 'date', new Date(dueDate ?? Date.now()))}
                  >
                    <Text style={[styles.fieldText, !dueDate && styles.placeholder]}>
                      {dueDate ? formatDateShort(dueDate) : 'DD/MM/AAAA'}
                    </Text>
                  </Pressable>
                  {dueDate !== null && (
                    <Pressable style={styles.clearBtn} onPress={() => setDueDate(null)}>
                      <Text style={styles.clearText}>Quitar</Text>
                    </Pressable>
                  )}
                </View>
              </Field>
            </>
          )}

          {kind === 'N' && (
            <Field label="Contenido">
              <TextInput
                style={[styles.input, styles.textarea]}
                value={desc}
                onChangeText={setDesc}
                multiline
              />
            </Field>
          )}

          {kind === 'E' && (
            <>
              <Field label="Descripción">
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />
              </Field>
              <View style={styles.evGrid}>
                <Field label="Inicio" style={styles.evWide}>
                  <Pressable style={styles.input} onPress={() => openPicker('startDay', 'date', new Date(startDay))}>
                    <Text style={styles.fieldText}>{formatDateShort(startDay)}</Text>
                  </Pressable>
                </Field>
                <Field label="Hora" style={styles.evNarrow}>
                  <Pressable
                    style={styles.input}
                    onPress={() => openPicker('startTime', 'time', timeToVal(startTime))}
                  >
                    <Text style={[styles.fieldText, !startTime && styles.placeholder]}>
                      {startTime ?? 'HH:mm'}
                    </Text>
                  </Pressable>
                </Field>
                <Field label="Fin" style={styles.evWide}>
                  <Pressable style={styles.input} onPress={() => openPicker('endDay', 'date', new Date(endDay))}>
                    <Text style={styles.fieldText}>{formatDateShort(endDay)}</Text>
                  </Pressable>
                </Field>
                <Field label="Hora" style={styles.evNarrow}>
                  <Pressable
                    style={styles.input}
                    onPress={() => openPicker('endTime', 'time', timeToVal(endTime))}
                  >
                    <Text style={[styles.fieldText, !endTime && styles.placeholder]}>
                      {endTime ?? 'HH:mm'}
                    </Text>
                  </Pressable>
                </Field>
              </View>
            </>
          )}

          {kind === 'H' && (
            <>
              <Field label="Nombre del hábito">
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />
              </Field>
              <Field label="Fecha de inicio">
                <Pressable style={styles.input} onPress={() => openPicker('startDay', 'date', new Date(startDay))}>
                  <Text style={styles.fieldText}>{formatDateShort(startDay)}</Text>
                </Pressable>
              </Field>
              <Pressable style={styles.toggleRow} onPress={() => setHabitActive(!habitActive)}>
                <Text style={styles.toggleText}>Seguimiento</Text>
                <Text style={[styles.toggleState, habitActive && { color: c.dark }]}>
                  {habitActive ? 'Activo' : 'Pausado'}
                </Text>
              </Pressable>
            </>
          )}

          <Field label="Categorías" hint="(una o varias)">
            <View style={styles.catsWrap}>
              {categories.map((cat) => {
                const on = cats.includes(cat.id);
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.catChip, on && styles.catChipOn]}
                    onPress={() => setCats((prev) => (on ? prev.filter((x) => x !== cat.id) : [...prev, cat.id]))}
                  >
                    {on && <CheckIcon size={14} color={palette.onInk} strokeWidth={3} />}
                    <Text style={[styles.catText, on && { color: palette.onInk }]}>{cat.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          {pickerNode}
        </ScrollView>

        <View style={styles.saveBar}>
          <Pressable
            style={[styles.saveBtn, { backgroundColor: c.dark }, saving && { opacity: 0.6 }]}
            disabled={saving}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>{saving ? 'Guardando…' : 'Guardar cambios'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  hint,
  style,
  children,
}: {
  label: string;
  hint?: string;
  style?: object;
  children: React.ReactNode;
}) {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>
        {label} {hint ? <Text style={styles.labelHint}>{hint}</Text> : null}
      </Text>
      {children}
    </View>
  );
}

const makeStyles = (palette: Palette) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  header: {
    padding: 14,
    paddingLeft: 8,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.display, fontSize: 19, color: palette.ink },
  notFound: { padding: 24, fontSize: 15, color: palette.inkSoft, textAlign: 'center' },
  form: { padding: 16, paddingBottom: 120, gap: 18 },
  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  labelHint: { fontFamily: fonts.medium, color: palette.inkSoft },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    fontSize: 15,
    color: palette.ink,
    fontFamily: fonts.body,
    justifyContent: 'center',
  },
  textarea: { height: 132, paddingTop: 12, textAlignVertical: 'top', lineHeight: 22 },
  fieldText: { fontSize: 15, color: palette.ink, fontFamily: fonts.body },
  placeholder: { color: palette.inkSoft },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  flex: { flex: 1 },
  clearBtn: { height: 50, paddingHorizontal: 14, justifyContent: 'center' },
  clearText: { fontSize: 14, fontFamily: fonts.semibold, color: palette.inkSoft },
  evGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  evWide: { flexBasis: '55%', flexGrow: 1 },
  evNarrow: { flexBasis: '35%', flexGrow: 1 },
  saveBar: {
    padding: 12,
    paddingBottom: 20,
    backgroundColor: palette.bg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  saveBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 16, fontFamily: fonts.bold, color: palette.white },
  catsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catChipOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  catText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  toggleRow: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: { fontSize: 15, fontFamily: fonts.semibold, color: palette.ink },
  toggleState: { fontSize: 14, fontFamily: fonts.semibold, color: palette.inkSoft },
});
