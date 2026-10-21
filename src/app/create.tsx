import React, { useEffect, useState } from 'react';
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
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createTask,
  createNote,
  createEvent,
  createHabit,
  getCategories,
  createCategory,
  setRecordCategories,
} from '../database';
import type { Category } from '../database/types';
import { fonts, palette, RecordKind } from '../theme/tokens';
import { startOfDay } from '../domain/records';
import { generateId } from '../utils/id';
import {
  CloseIcon,
  TaskTypeIcon,
  NoteTypeIcon,
  EventTypeIcon,
  HabitIcon,
  CheckIcon,
  PlusIcon,
} from '../components/icons';

const TYPE_DEFS: { id: RecordKind; label: string }[] = [
  { id: 'T', label: 'Tarea' },
  { id: 'N', label: 'Nota' },
  { id: 'E', label: 'Cita' },
  { id: 'H', label: 'Hábito' },
];

const SAVE_LABEL: Record<RecordKind, string> = {
  T: 'Guardar tarea',
  N: 'Guardar nota',
  E: 'Guardar cita',
  H: 'Crear hábito',
};

const TASK_STATES = ['Sin iniciar', 'En progreso'];
const EVENT_STATES = ['Próximamente', 'En curso', 'Realizado', 'Cancelado'];
const NOTE_CLASSES = ['Idea', 'Reflexión', 'Nota'];
const DAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAY_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

function daysToString(days: boolean[]): string {
  return days.map((on) => (on ? '1' : '0')).join('');
}

type PickerState = { field: string; mode: 'date' | 'time'; value: Date } | null;

export default function CreateScreen() {
  const [type, setType] = useState<RecordKind>('T');
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerState>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [newCat, setNewCat] = useState<string | null>(null);

  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState<number | null>(null);
  const [taskSt, setTaskSt] = useState(0);

  const [noteContent, setNoteContent] = useState('');
  const [noteCls, setNoteCls] = useState(0);

  const [evDesc, setEvDesc] = useState('');
  const [evStartDay, setEvStartDay] = useState<number>(() => startOfDay(Date.now()));
  const [evStartTime, setEvStartTime] = useState<string | null>(null);
  const [evEndDay, setEvEndDay] = useState<number>(() => startOfDay(Date.now()));
  const [evEndTime, setEvEndTime] = useState<string | null>(null);
  const [evLoc, setEvLoc] = useState('');
  const [evSt, setEvSt] = useState(0);

  const [hName, setHName] = useState('');
  const [hStart, setHStart] = useState<number>(() => startOfDay(Date.now()));
  const [hDays, setHDays] = useState<boolean[]>([true, true, true, true, true, false, false]);
  const [hActive, setHActive] = useState(true);

  useEffect(() => {
    getCategories()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      .then((all) => setCategories(all.filter((cat) => !cat.archived)))
      .catch(() => {});
  }, []);

  const c = {
    T: { tint: '#EAF2F8', dark: '#1F618D', base: '#2980B9' },
    N: { tint: '#E8F6F3', dark: '#0E6655', base: '#16A085' },
    E: { tint: '#F4ECF7', dark: '#7D3C98', base: '#9B59B6' },
    H: { tint: '#FDF2E9', dark: '#A04000', base: '#E67E22' },
  }[type];

  const fail = (message: string): null => {
    Alert.alert('Revisa el formulario', message);
    return null;
  };

  const buildSave = (): (() => Promise<void>) | null => {
    if (type === 'T') {
      const desc = taskDesc.trim();
      if (!desc) return fail('Escribe una descripción.');
      return async () => {
        const t = await createTask(generateId(), desc, taskDue ?? undefined, taskSt === 1 ? 'in_progress' : 'pending');
        await setRecordCategories(t.id, cats);
      };
    }
    if (type === 'N') {
      const content = noteContent.trim();
      if (!content) return fail('Escribe el contenido de la nota.');
      const cls = (['important', 'reflection', 'reminder'] as const)[noteCls];
      return async () => {
        const n = await createNote(generateId(), content, cls);
        await setRecordCategories(n.id, cats);
      };
    }
    if (type === 'E') {
      const desc = evDesc.trim();
      if (!desc) return fail('Escribe una descripción.');
      if (!evStartTime) return fail('Indica la hora de inicio.');
      if (!evEndTime) return fail('Indica la hora de fin.');
      if (evEndDay < evStartDay) return fail('El fin no puede ser anterior al inicio.');
      const status = (['upcoming', 'in_progress', 'completed', 'cancelled'] as const)[evSt];
      return async () => {
        const e = await createEvent(
          generateId(),
          desc,
          evStartDay,
          evStartTime,
          evEndDay,
          evEndTime,
          status,
          evLoc.trim() || undefined
        );
        await setRecordCategories(e.id, cats);
      };
    }
    const name = hName.trim();
    if (!name) return fail('Escribe el nombre del hábito.');
    return async () => {
      const h = await createHabit(generateId(), name, hStart, hActive, daysToString(hDays));
      await setRecordCategories(h.id, cats);
    };
  };

  const handleSave = async () => {
    const action = buildSave();
    if (!action) return;
    try {
      setSaving(true);
      await action();
      router.navigate('/');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addCategory = async () => {
    const name = (newCat ?? '').trim();
    if (!name) return;
    try {
      const created = await createCategory(generateId(), name);
      setCategories((prev) => [...prev, created]);
      setCats((prev) => [...prev, created.id]);
      setNewCat(null);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
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
      if (current.field === 'taskDue') setTaskDue(ts);
      if (current.field === 'evStartDay') {
        setEvStartDay(ts);
        if (evEndDay < ts) setEvEndDay(ts);
      }
      if (current.field === 'evEndDay') setEvEndDay(ts);
      if (current.field === 'hStart') setHStart(ts);
    } else {
      const time = valToTime(selected);
      if (current.field === 'evStartTime') setEvStartTime(time);
      if (current.field === 'evEndTime') setEvEndTime(time);
    }
  };

  const seg = (on: boolean) => [
    styles.seg,
    on && { backgroundColor: c.tint, borderColor: c.base, borderWidth: 2 },
    !on && styles.segOff,
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.closeBtn} accessibilityLabel="Cerrar sin guardar" onPress={() => router.back()}>
          <CloseIcon size={22} color={palette.ink} strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.headerTitle}>Nuevo registro</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.typesRow}>
        {TYPE_DEFS.map((t) => {
          const on = type === t.id;
          const k = {
            T: { tint: '#EAF2F8', dark: '#1F618D', base: '#2980B9' },
            N: { tint: '#E8F6F3', dark: '#0E6655', base: '#16A085' },
            E: { tint: '#F4ECF7', dark: '#7D3C98', base: '#9B59B6' },
            H: { tint: '#FDF2E9', dark: '#A04000', base: '#E67E22' },
          }[t.id];
          return (
            <Pressable
              key={t.id}
              style={[
                styles.typeBtn,
                on && { backgroundColor: k.tint, borderColor: k.base, borderWidth: 2 },
                !on && styles.typeBtnOff,
              ]}
              onPress={() => setType(t.id)}
            >
              {t.id === 'T' && <TaskTypeIcon size={22} color={on ? k.dark : palette.ink} />}
              {t.id === 'N' && <NoteTypeIcon size={22} color={on ? k.dark : palette.ink} />}
              {t.id === 'E' && <EventTypeIcon size={22} color={on ? k.dark : palette.ink} />}
              {t.id === 'H' && <HabitIcon size={22} color={on ? k.dark : palette.ink} />}
              <Text style={[styles.typeLabel, { color: on ? k.dark : palette.ink }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          {type === 'T' && (
            <>
              <Field label="Descripción">
                <TextInput
                  style={styles.input}
                  placeholder="¿Qué hay que hacer?"
                  placeholderTextColor={palette.inkSoft}
                  value={taskDesc}
                  onChangeText={setTaskDesc}
                />
              </Field>
              <Field label="Fecha límite" hint="(opcional)">
                <Pressable style={styles.input} onPress={() => openPicker('taskDue', 'date', new Date(taskDue ?? Date.now()))}>
                  <Text style={[styles.fieldText, !taskDue && styles.placeholder]}>
                    {taskDue ? formatDateShort(taskDue) : 'DD/MM/AAAA'}
                  </Text>
                </Pressable>
                {picker?.field === 'taskDue' && (
                  <DateTimePicker value={picker.value} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                )}
              </Field>
              <Field label="Estado inicial">
                <View style={styles.segGrid}>
                  {TASK_STATES.map((label, i) => (
                    <Pressable key={label} style={seg(taskSt === i)} onPress={() => setTaskSt(i)}>
                      <Text style={[styles.segText, taskSt === i && { color: c.dark }]}>{label}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>
            </>
          )}

          {type === 'N' && (
            <>
              <Field label="Contenido">
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Escribe una idea, un recuerdo o una reflexión…"
                  placeholderTextColor={palette.inkSoft}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  multiline
                />
              </Field>
              <Field label="Clasificación">
                <View style={styles.segGrid}>
                  {NOTE_CLASSES.map((label, i) => (
                    <Pressable key={label} style={seg(noteCls === i)} onPress={() => setNoteCls(i)}>
                      <Text style={[styles.segText, noteCls === i && { color: c.dark }]}>{label}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>
            </>
          )}

          {type === 'E' && (
            <>
              <Field label="Descripción">
                <TextInput
                  style={styles.input}
                  placeholder="Ej.: Cena con Marta"
                  placeholderTextColor={palette.inkSoft}
                  value={evDesc}
                  onChangeText={setEvDesc}
                />
              </Field>
              <View style={styles.evGrid}>
                <Field label="Inicio" style={styles.evWide}>
                  <Pressable style={styles.input} onPress={() => openPicker('evStartDay', 'date', new Date(evStartDay))}>
                    <Text style={styles.fieldText}>{formatDateShort(evStartDay)}</Text>
                  </Pressable>
                  {picker?.field === 'evStartDay' && (
                    <DateTimePicker value={picker.value} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                  )}
                </Field>
                <Field label="Hora" style={styles.evNarrow}>
                  <Pressable style={styles.input} onPress={() => openPicker('evStartTime', 'time', timeToVal(evStartTime))}>
                    <Text style={[styles.fieldText, !evStartTime && styles.placeholder]}>
                      {evStartTime ?? 'HH:mm'}
                    </Text>
                  </Pressable>
                  {picker?.field === 'evStartTime' && (
                    <DateTimePicker value={picker.value} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                  )}
                </Field>
                <Field label="Fin" style={styles.evWide}>
                  <Pressable style={styles.input} onPress={() => openPicker('evEndDay', 'date', new Date(evEndDay))}>
                    <Text style={styles.fieldText}>{formatDateShort(evEndDay)}</Text>
                  </Pressable>
                  {picker?.field === 'evEndDay' && (
                    <DateTimePicker value={picker.value} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                  )}
                </Field>
                <Field label="Hora" style={styles.evNarrow}>
                  <Pressable style={styles.input} onPress={() => openPicker('evEndTime', 'time', timeToVal(evEndTime))}>
                    <Text style={[styles.fieldText, !evEndTime && styles.placeholder]}>
                      {evEndTime ?? 'HH:mm'}
                    </Text>
                  </Pressable>
                  {picker?.field === 'evEndTime' && (
                    <DateTimePicker value={picker.value} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                  )}
                </Field>
              </View>
              <Text style={styles.hint}>El fin no puede ser anterior al inicio.</Text>
              <Field label="Lugar" hint="(opcional, texto libre)">
                <TextInput
                  style={styles.input}
                  placeholder="Oficina, Casa, Google Meet…"
                  placeholderTextColor={palette.inkSoft}
                  value={evLoc}
                  onChangeText={setEvLoc}
                />
              </Field>
              <Field label="Estado">
                <View style={styles.segGrid}>
                  {EVENT_STATES.map((label, i) => (
                    <Pressable key={label} style={seg(evSt === i)} onPress={() => setEvSt(i)}>
                      <Text style={[styles.segText, evSt === i && { color: c.dark }]}>{label}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.hint}>
                  «Próximamente» y «En curso» se calculan con la fecha y la hora. «Realizado» y «Cancelado» los indicas tú.
                </Text>
              </Field>
            </>
          )}

          {type === 'H' && (
            <>
              <Field label="Nombre del hábito">
                <TextInput
                  style={styles.input}
                  placeholder="Ej.: Caminar 30 minutos"
                  placeholderTextColor={palette.inkSoft}
                  value={hName}
                  onChangeText={setHName}
                />
              </Field>
              <Field label="Fecha de inicio">
                <Pressable style={styles.input} onPress={() => openPicker('hStart', 'date', new Date(hStart))}>
                  <Text style={styles.fieldText}>{formatDateShort(hStart)}</Text>
                </Pressable>
                {picker?.field === 'hStart' && (
                  <DateTimePicker value={picker.value} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={onPickerChange} />
                )}
              </Field>
              <Field label="Días previstos">
                <View style={styles.daysRow}>
                  {DAY_LETTERS.map((letter, i) => (
                    <Pressable
                      key={letter}
                      style={[styles.dayBtn, hDays[i] && styles.dayBtnOn]}
                      accessibilityLabel={DAY_LONG[i]}
                      onPress={() => setHDays((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                    >
                      <Text style={[styles.dayText, hDays[i] && styles.dayTextOn]}>{letter}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.hint}>
                  Si un día previsto termina sin registro, pasa a «No realizado». Los días no previstos no cuentan.
                </Text>
              </Field>
              <Pressable style={styles.switchRow} onPress={() => setHActive(!hActive)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchTitle}>Seguimiento activo</Text>
                  <Text style={styles.switchSub}>Desactívalo para pausar sin perder el historial</Text>
                </View>
                <View style={[styles.switchTrack, { backgroundColor: hActive ? c.dark : palette.switchOff }]}>
                  <View style={[styles.switchKnob, hActive && { alignSelf: 'flex-end' }]} />
                </View>
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
                    {on && <CheckIcon size={14} color={palette.white} strokeWidth={3} />}
                    <Text style={[styles.catText, on && { color: palette.white }]}>{cat.name}</Text>
                  </Pressable>
                );
              })}
              {newCat === null ? (
                <Pressable style={styles.newCatBtn} onPress={() => setNewCat('')}>
                  <PlusIcon size={14} color={palette.ink} strokeWidth={2.6} />
                  <Text style={styles.newCatText}>Nueva</Text>
                </Pressable>
              ) : (
                <View style={styles.newCatRow}>
                  <TextInput
                    style={styles.newCatInput}
                    placeholder="Nombre"
                    placeholderTextColor={palette.inkSoft}
                    value={newCat}
                    onChangeText={setNewCat}
                    autoFocus
                    onSubmitEditing={addCategory}
                  />
                  <Pressable style={styles.newCatAdd} onPress={addCategory}>
                    <Text style={styles.newCatAddText}>Añadir</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Field>
        </ScrollView>

        <View style={styles.saveBar}>
          <Pressable
            style={[styles.saveBtn, { backgroundColor: c.dark }, saving && { opacity: 0.6 }]}
            disabled={saving}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>{saving ? 'Guardando…' : SAVE_LABEL[type]}</Text>
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
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>
        {label} {hint ? <Text style={styles.labelHint}>{hint}</Text> : null}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
  typesRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  typeBtn: {
    flex: 1,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  typeBtnOff: { backgroundColor: palette.white, borderColor: palette.borderChip, borderWidth: 1 },
  typeLabel: { fontSize: 13, fontFamily: fonts.bold },
  form: { padding: 16, paddingBottom: 120, gap: 18 },
  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  labelHint: { fontFamily: fonts.medium, color: palette.inkSoft },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    paddingHorizontal: 14,
    fontSize: 15,
    color: palette.ink,
    fontFamily: fonts.body,
    justifyContent: 'center',
  },
  textarea: { height: 132, paddingTop: 12, textAlignVertical: 'top', lineHeight: 22 },
  fieldText: { fontSize: 15, color: palette.ink, fontFamily: fonts.body },
  placeholder: { color: palette.inkSoft },
  segGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  seg: {
    flexGrow: 1,
    minWidth: '45%',
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: palette.white,
  },
  segOff: { borderColor: palette.borderInput, borderWidth: 1 },
  segText: { fontSize: 14, fontFamily: fonts.semibold, color: palette.ink },
  hint: { fontSize: 12, color: palette.inkSoft, lineHeight: 17 },
  evGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  evWide: { flexBasis: '55%', flexGrow: 1 },
  evNarrow: { flexBasis: '35%', flexGrow: 1 },
  daysRow: { flexDirection: 'row', gap: 6 },
  dayBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnOn: { backgroundColor: '#A04000', borderColor: '#A04000' },
  dayText: { fontSize: 14, fontFamily: fonts.bold, color: palette.ink },
  dayTextOn: { color: palette.white },
  switchRow: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchTitle: { fontSize: 15, fontFamily: fonts.semibold, color: palette.ink },
  switchSub: { fontSize: 12, color: palette.inkSoft, marginTop: 2 },
  switchTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  catsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catChipOn: { backgroundColor: palette.ink, borderColor: palette.ink },
  catText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  newCatBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: palette.dashed,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newCatText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  newCatRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  newCatInput: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.borderInput,
    backgroundColor: palette.white,
    fontSize: 14,
    color: palette.ink,
    fontFamily: fonts.body,
    minWidth: 140,
  },
  newCatAdd: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCatAddText: { fontSize: 13, fontFamily: fonts.semibold, color: palette.white },
  saveBar: {
    padding: 12,
    paddingBottom: 20,
    backgroundColor: palette.bg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  saveBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 16, fontFamily: fonts.bold, color: palette.white },
});
