import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";
import {
  createCategory,
  getCategories,
  getEvent,
  getHabit,
  getNote,
  getRecordCategoryMap,
  purgeRecord,
  setRecordCategories,
  updateEvent,
  updateHabit,
  updateNote,
} from "../../database";
import type { Category, Event, Habit, Note } from "../../database/types";
import { startOfDay, summarizeDays } from "../../domain/records";
import { useTasks } from "../../hooks";
import { Task } from "../../models";
import { useThemeColors } from "../../theme/AppearanceContext";
import { generateId } from "../../utils/id";

const EVENT_STATE_LABEL: Record<Event["status"], string> = {
  upcoming: "Próximamente",
  in_progress: "En progreso",
  completed: "Realizado",
  cancelled: "Cancelado",
};

const DETAIL_TITLES: Record<string, string> = {
  T: "Detalle de la tarea",
  N: "Detalle de la nota",
  E: "Detalle del evento",
  H: "Detalle del hábito",
};

function formatLong(ts: number): string {
  return new Date(ts).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatShort(ts: number): string {
  const d = new Date(ts);
  return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
}

function valToTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes());
}

function timeToVal(time: string): Date {
  const d = new Date();
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

type PickerState = { field: string; mode: "date" | "time"; value: Date } | null;

export default function DetailScreen() {
  const themeColors = useThemeColors();
  const colors = useMemo(() => ({ light: themeColors }), [themeColors]);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: string }>();
  const isHabit = kind === "H";
  const isEvent = kind === "E";
  const isNote = kind === "N";
  const { tasks, updateExistingTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [newCat, setNewCat] = useState<string | null>(null);
  const [picker, setPicker] = useState<PickerState>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  type DeleteOption = { label: string; run: () => Promise<unknown> };

  const deleteOptions = (): DeleteOption[] => {
    if (task) {
      return [
        {
          label: "Marcar como cancelada",
          run: () => updateExistingTask(task.id, { status: "deleted" }),
        },
        {
          label: "Marcar como culminada",
          run: () =>
            updateExistingTask(task.id, {
              status: "completed",
              completed_at: Date.now(),
            }),
        },
      ];
    }
    if (event) {
      return [
        {
          label: "Marcar como cancelado",
          run: () => updateEvent(id, { status: "cancelled" }),
        },
        {
          label: "Marcar como culminado",
          run: () => updateEvent(id, { status: "completed" }),
        },
      ];
    }
    if (habit) {
      return [
        {
          label: "Desactivar seguimiento",
          run: () => updateHabit(id, { active: false }),
        },
      ];
    }
    return [];
  };

  const deleteHint = (): string => {
    if (task)
      return "¿Prefieres marcarla como cancelada o culminada en lugar de borrarla?";
    if (event)
      return "¿Prefieres marcarla como cancelada o culminada en lugar de borrarla?";
    if (habit)
      return "¿Prefieres desactivar el seguimiento en lugar de borrarlo?";
    return "";
  };

  const runDeleteOption = async (option: DeleteOption) => {
    setDeleteOpen(false);
    try {
      await option.run();
      router.back();
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  const confirmPurge = () => {
    setDeleteOpen(false);
    Alert.alert(
      "Eliminar definitivamente",
      "Se borrará de la base de datos y no se podrá recuperar. ¿Seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await purgeRecord(id);
              router.back();
            } catch (err) {
              Alert.alert("Error", (err as Error).message);
            }
          },
        },
      ],
    );
  };

  const description = isHabit
    ? habit?.name
    : isEvent
      ? event?.description
      : isNote
        ? note?.content
        : task?.description;

  const startEditing = () => {
    setDraft(description ?? "");
    setEditing(true);
  };

  const saveDescription = async () => {
    const text = draft.trim();
    if (!text) {
      Alert.alert("Revisa el formulario", "Escribe una descripción.");
      return;
    }
    try {
      setSaving(true);
      if (isHabit) {
        setHabit(await updateHabit(id, { name: text }));
      } else if (isEvent) {
        setEvent(await updateEvent(id, { description: text }));
      } else if (isNote) {
        setNote(await updateNote(id, { content: text }));
      } else if (task) {
        await updateExistingTask(task.id, { description: text });
      }
      setEditing(false);
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const applyDate = async (
    field: string,
    mode: "date" | "time",
    value: Date,
  ) => {
    try {
      if (field === "taskDue" && task) {
        await updateExistingTask(task.id, {
          due_date: startOfDay(value.getTime()),
        });
        return;
      }
      if (field === "habitStart") {
        setHabit(
          await updateHabit(id, { start_date: startOfDay(value.getTime()) }),
        );
        return;
      }
      if (event) {
        const isStart = field === "evStart";
        const current = {
          start_date: event.start_date,
          start_time: event.start_time,
          end_date: event.end_date,
          end_time: event.end_time,
        };
        const next = { ...current };
        if (mode === "date") {
          if (isStart) next.start_date = startOfDay(value.getTime());
          else next.end_date = startOfDay(value.getTime());
        } else {
          if (isStart) next.start_time = valToTime(value);
          else next.end_time = valToTime(value);
        }
        if (
          next.end_date < next.start_date ||
          (next.end_date === next.start_date && next.end_time < next.start_time)
        ) {
          Alert.alert(
            "Revisa las fechas",
            "El fin no puede ser anterior al inicio.",
          );
          return;
        }
        const updated = await updateEvent(id, next);
        if (updated) setEvent(updated);
      }
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  const onPickerChange = (_e: unknown, selected?: Date) => {
    const current = picker;
    setPicker(Platform.OS === "ios" ? current : null);
    if (!selected || !current) return;
    applyDate(current.field, current.mode, selected);
  };

  const openPicker = (
    field: string,
    mode: "date" | "time",
    value: number | string,
  ) => {
    const date =
      mode === "date" ? new Date(value as number) : timeToVal(value as string);
    setPicker({ field, mode, value: date });
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([getCategories(), getRecordCategoryMap()])
      .then(([all, map]) => {
        setCategories(all.filter((cat) => !cat.archived));
        setCats(map[id] ?? []);
      })
      .catch(() => {});
  }, [id]);

  const toggleCategory = async (catId: string) => {
    const next = cats.includes(catId)
      ? cats.filter((x) => x !== catId)
      : [...cats, catId];
    const previous = cats;
    setCats(next);
    try {
      await setRecordCategories(id, next);
    } catch (err) {
      setCats(previous);
      Alert.alert("Error", (err as Error).message);
    }
  };

  const addCategory = async () => {
    const name = (newCat ?? "").trim();
    if (!name) return;
    try {
      const created = await createCategory(generateId(), name);
      setCategories((prev) => [...prev, created]);
      setNewCat(null);
      await toggleCategory(created.id);
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (isHabit) {
      getHabit(id)
        .then(setHabit)
        .catch(() => setHabit(null))
        .finally(() => setLoading(false));
      return;
    }
    if (isEvent) {
      getEvent(id)
        .then(setEvent)
        .catch(() => setEvent(null))
        .finally(() => setLoading(false));
      return;
    }
    if (isNote) {
      getNote(id)
        .then(setNote)
        .catch(() => setNote(null))
        .finally(() => setLoading(false));
      return;
    }
    if (tasks) {
      const found = tasks.find((t) => t.id === id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTask(found || null);
      setLoading(false);
    }
  }, [tasks, id, isHabit, isEvent, isNote]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isHabit ? !habit : isEvent ? !event : isNote ? !note : !task) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome
              name="arrow-left"
              size={24}
              color={colors.light.text}
            />
          </Pressable>
          <Text style={styles.title}>Detalle</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>Registro no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOverdue = !!task && task.isOverdue();
  const created = isHabit
    ? habit!.created_at
    : isEvent
      ? event!.created_at
      : isNote
        ? note!.created_at
        : task!.created_at;

  const dateChip = (label: string, onPress: () => void) => (
    <Pressable
      style={styles.dateChip}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <FontAwesome name="calendar" size={13} color={colors.light.primary} />
      <Text style={styles.dateChipText}>{label}</Text>
    </Pressable>
  );

  const timeChip = (label: string, onPress: () => void) => (
    <Pressable
      style={styles.dateChip}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <FontAwesome name="clock-o" size={13} color={colors.light.primary} />
      <Text style={styles.dateChipText}>{label}</Text>
    </Pressable>
  );

  const pickerNode = picker && (
    <DateTimePicker
      value={picker.value}
      mode={picker.mode}
      display={Platform.OS === "ios" ? "inline" : "default"}
      onValueChange={onPickerChange}
      onDismiss={() => setPicker(null)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.light.text} />
        </Pressable>
        <Text style={styles.title}>
          {DETAIL_TITLES[kind ?? "T"] ?? "Detalle del registro"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Descripcion</Text>
            {!editing && (
              <Pressable
                onPress={startEditing}
                hitSlop={12}
                style={styles.editButton}
                accessibilityRole="button"
                accessibilityLabel="Editar descripción"
              >
                <FontAwesome
                  name="pencil"
                  size={14}
                  color={colors.light.primary}
                />
                <Text style={styles.editButtonText}>Editar</Text>
              </Pressable>
            )}
          </View>
          {editing ? (
            <View style={styles.editBox}>
              <View style={styles.editInputWrap}>
                <TextInput
                  style={styles.editInput}
                  value={draft}
                  onChangeText={setDraft}
                  multiline
                  autoFocus
                />
                <View style={styles.editIcons}>
                  <Pressable
                    style={styles.editIconBtn}
                    onPress={() => setEditing(false)}
                    disabled={saving}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Cancelar edición"
                  >
                    <FontAwesome
                      name="times"
                      size={16}
                      color={colors.light.textSecondary}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.editIconBtn}
                    onPress={saveDescription}
                    disabled={saving}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Guardar descripción"
                  >
                    <FontAwesome
                      name="check"
                      size={16}
                      color={colors.light.primary}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <Pressable onPress={startEditing} accessibilityRole="button">
              <Text style={styles.description}>{description}</Text>
            </Pressable>
          )}
        </View>

        {task && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado</Text>
            <Text style={[styles.status, isOverdue && styles.overdue]}>
              {task.status === "completed"
                ? "Completado"
                : task.status === "in_progress"
                  ? "En Progreso"
                  : "Pendiente"}
            </Text>
          </View>
        )}

        {task?.due_date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vencimiento</Text>
            {dateChip(
              formatLong(task.due_date) + (isOverdue ? " (Vencido)" : ""),
              () => openPicker("taskDue", "date", task.due_date!),
            )}
            {picker?.field === "taskDue" && pickerNode}
          </View>
        )}

        {event && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Inicio</Text>
              <View style={styles.dateRow}>
                {dateChip(formatShort(event.start_date), () =>
                  openPicker("evStart", "date", event.start_date),
                )}
                {timeChip(event.start_time, () =>
                  openPicker("evStart", "time", event.start_time),
                )}
              </View>
              {picker?.field === "evStart" && pickerNode}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fin</Text>
              <View style={styles.dateRow}>
                {dateChip(formatShort(event.end_date), () =>
                  openPicker("evEnd", "date", event.end_date),
                )}
                {timeChip(event.end_time, () =>
                  openPicker("evEnd", "time", event.end_time),
                )}
              </View>
              {picker?.field === "evEnd" && pickerNode}
            </View>
            {!!event.location && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lugar</Text>
                <Text style={styles.dueDate}>{event.location}</Text>
              </View>
            )}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado</Text>
              <Text style={styles.dueDate}>
                {EVENT_STATE_LABEL[event.status]}
              </Text>
            </View>
          </>
        )}

        {habit && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Días previstos</Text>
              <Text style={styles.dueDate}>{summarizeDays(habit.days)}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Inicio</Text>
              {dateChip(formatLong(habit.start_date), () =>
                openPicker("habitStart", "date", habit.start_date),
              )}
              {picker?.field === "habitStart" && pickerNode}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seguimiento</Text>
              <Text style={styles.dueDate}>
                {habit.active ? "Activo" : "Pausado"}
              </Text>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creado</Text>
          <Text style={styles.date}>
            {new Date(created).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.catsWrap}>
            {categories.map((cat) => {
              const on = cats.includes(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.catChip, on && styles.catChipOn]}
                  onPress={() => toggleCategory(cat.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                >
                  {on && <FontAwesome name="check" size={12} color="#FFFFFF" />}
                  <Text style={[styles.catText, on && styles.catTextOn]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
            {newCat === null ? (
              <Pressable style={styles.catChip} onPress={() => setNewCat("")}>
                <FontAwesome name="plus" size={12} color={colors.light.text} />
                <Text style={styles.catText}>Nueva</Text>
              </Pressable>
            ) : (
              <View style={styles.newCatRow}>
                <TextInput
                  style={styles.newCatInput}
                  placeholder="Nombre"
                  value={newCat}
                  onChangeText={setNewCat}
                  autoFocus
                  onSubmitEditing={addCategory}
                />
                <Pressable style={styles.catChipOn} onPress={addCategory}>
                  <Text style={styles.catTextOn}>Añadir</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {task && task.status !== "completed" && (
            <Button
              label="Aceptar"
              variant="primary"
              style={{ backgroundColor: colors.light.primary }}
              onPress={() => {
                // TODO: Implementar completar
                router.back();
              }}
            />
          )}
          <Button
            label="Eliminar"
            variant="secondary"
            onPress={() => setDeleteOpen(true)}
          />
        </View>
      </ScrollView>

      <Modal
        visible={deleteOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setDeleteOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Eliminar registro</Text>
            <Text style={styles.sheetText}>
              {deleteHint() || "¿Qué quieres hacer con este registro?"}
            </Text>
            {deleteOptions().map((option) => (
              <Pressable
                key={option.label}
                style={styles.sheetOption}
                onPress={() => runDeleteOption(option)}
              >
                <Text style={styles.sheetOptionText}>{option.label}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.sheetOption} onPress={confirmPurge}>
              <Text style={styles.sheetDanger}>Eliminar definitivamente</Text>
            </Pressable>
            <Pressable
              style={styles.sheetCancel}
              onPress={() => setDeleteOpen(false)}
            >
              <Text style={styles.sheetCancelText}>Cancelar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (colors: { light: typeof Colors.light }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.light.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomColor: colors.light.border,
      borderBottomWidth: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.light.textSecondary,
      textTransform: "uppercase",
      marginBottom: spacing.sm,
      letterSpacing: 0.5,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    editButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.light.primary,
    },
    editBox: {
      gap: spacing.md,
    },
    editInputWrap: {
      gap: 0,
    },
    editInput: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
      borderWidth: 1,
      borderColor: colors.light.border,
      borderRadius: 12,
      padding: spacing.md,
      minHeight: 56,
      textAlignVertical: "top",
    },
    editIcons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 6,
      marginTop: 6,
    },
    editIconBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.light.background,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    description: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
      lineHeight: 24,
    },
    status: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.light.primary,
      textTransform: "capitalize",
    },
    overdue: {
      color: "#DC2626",
    },
    dueDate: {
      fontSize: 16,
      color: colors.light.text,
    },
    overdueBad: {
      color: "#DC2626",
      fontWeight: "600",
    },
    dateRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    dateChip: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.light.border,
      backgroundColor: colors.light.background,
    },
    dateChipText: {
      fontSize: 15,
      color: colors.light.text,
    },
    date: {
      fontSize: 14,
      color: colors.light.textSecondary,
    },
    buttonContainer: {
      marginTop: spacing.xl,
      gap: spacing.md,
    },
    errorText: {
      fontSize: 16,
      color: "#EF4444",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      padding: spacing.lg,
    },
    sheet: {
      backgroundColor: colors.light.card,
      borderRadius: 16,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.light.text,
    },
    sheetText: {
      fontSize: 14,
      color: colors.light.textSecondary,
      marginBottom: spacing.sm,
    },
    sheetOption: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    sheetOptionText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.light.text,
    },
    sheetDanger: {
      fontSize: 16,
      fontWeight: "600",
      color: "#DC2626",
    },
    sheetCancel: {
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    sheetCancelText: {
      fontSize: 16,
      color: colors.light.textSecondary,
    },
    catsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    catChip: {
      height: 40,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.light.border,
      backgroundColor: colors.light.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    catChipOn: {
      backgroundColor: colors.light.primary,
      borderColor: colors.light.primary,
    },
    catText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.light.text,
    },
    catTextOn: {
      color: "#FFFFFF",
    },
    newCatRow: {
      flexDirection: "row",
      gap: spacing.sm,
      alignItems: "center",
    },
    newCatInput: {
      height: 40,
      minWidth: 140,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.light.border,
      fontSize: 14,
      color: colors.light.text,
    },
  });
