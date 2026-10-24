import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EventStateIcon,
  GearIcon,
  HabitIcon,
  LogoMark,
  NoteStateIcon,
  PlusIcon,
  TaskStateIcon,
} from "../../components/icons";
import {
  recordsOnDay,
  RecordView,
  startOfDay,
  weekdayIndex,
} from "../../domain/records";
import { useRecords } from "../../hooks/useRecords";
import { useAppearance, usePalette } from "../../theme/AppearanceContext";
import {
  palette,
  RecordKind,
  TypeColors,
} from "../../theme/tokens";
import { makeStyles } from '../../styles/app/(tabs)/index.styles';

const WEEKDAYS_LONG = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const MONTHS_LONG = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const DAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];

const CHIP_DEFS: [RecordKind | "all", string][] = [
  ["all", "Todo"],
  ["T", "Tareas"],
  ["E", "Citas"],
  ["N", "Notas"],
  ["H", "Hábitos"],
];

const GRAY = { bg: "#EFEEF3", fg: "#5E5C70" };

/**
 * Obtiene los colores y los indicadores visuales del icono de un registro.
 *
 * El estado de cada tipo de registro puede requerir un fondo, un borde circular
 * o un borde discontinuo diferente.
 *
 * @param kind Tipo de registro: tarea, evento, nota o hábito.
 * @param idx Índice visual del estado actual del registro.
 * @param colors Colores configurados para cada tipo de registro.
 * @returns Colores de fondo y primer plano, junto con los indicadores de borde.
 */
function tileColors(
  kind: RecordKind,
  idx: number,
  colors: Record<RecordKind, TypeColors>,
) {
  switch (kind) {
    case "T":
      return idx === 3
        ? { ...GRAY, ring: false, dashed: false }
        : { bg: colors.T.tint, fg: colors.T.dark, ring: false, dashed: false };
    case "E":
      if (idx === 0)
        return {
          bg: colors.E.tint,
          fg: colors.E.mid,
          ring: false,
          dashed: false,
        };
      if (idx === 1)
        return {
          bg: colors.E.base,
          fg: palette.white,
          ring: true,
          dashed: false,
        };
      if (idx === 2)
        return {
          bg: colors.E.dark,
          fg: palette.white,
          ring: false,
          dashed: false,
        };
      return { ...GRAY, ring: false, dashed: false };
    case "H":
      if (idx === 0)
        return {
          bg: colors.H.tint,
          fg: colors.H.mid,
          ring: false,
          dashed: true,
        };
      if (idx === 1)
        return {
          bg: colors.H.dark,
          fg: palette.white,
          ring: false,
          dashed: false,
        };
      return { ...GRAY, ring: false, dashed: false };
    case "N":
      return {
        bg: colors.N.tint,
        fg: colors.N.dark,
        ring: false,
        dashed: false,
      };
  }
}

/**
 * Indica si un registro se encuentra en un estado cerrado.
 *
 * Las tareas y los eventos se consideran cerrados desde el estado 2,
 * mientras que los hábitos se cierran desde el estado 1.
 *
 * @param r Registro cuyo estado se debe comprobar.
 * @returns `true` cuando el registro está cerrado; en caso contrario, `false`.
 */
function isClosed(r: RecordView): boolean {
  if (r.kind === "T" || r.kind === "E") return r.statusIndex >= 2;
  if (r.kind === "H") return r.statusIndex >= 1;
  return false;
}

/**
 * Indica si el título del registro debe mostrarse tachado.
 *
 * Solo las tareas y los eventos tienen un estado que representa explícitamente
 * un registro tachado.
 *
 * @param r Registro cuyo título se debe comprobar.
 * @returns `true` cuando el título debe mostrarse tachado.
 */
function isStruck(r: RecordView): boolean {
  return (r.kind === "T" || r.kind === "E") && r.statusIndex === 3;
}

/**
 * Convierte una marca de tiempo en una fecha larga localizada en español.
 *
 * @param ts Marca de tiempo en milisegundos desde el inicio de la época Unix.
 * @returns Fecha con el formato «Día, número de mes de año».
 */
function formatLongDate(ts: number): string {
  const d = new Date(ts);
  const wd = WEEKDAYS_LONG[d.getDay()];
  return (
    wd.charAt(0).toUpperCase() +
    wd.slice(1) +
    ", " +
    d.getDate() +
    " de " +
    MONTHS_LONG[d.getMonth()] +
    " de " +
    d.getFullYear()
  );
}

/**
 * Renderiza la pantalla principal de la cronología.
 *
 * La pantalla permite seleccionar un día de la semana, filtrar registros por
 * tipo, consultar sus estados, cambiar dichos estados y abrir las acciones de
 * edición o eliminación de cada registro.
 *
 * @returns La vista de cronología con sus controles, lista de registros y
 * botón para crear un registro nuevo.
 */
export default function CronologiaScreen() {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const { source, categories, cycleStatus, remove } = useRecords();
  const { colors } = useAppearance();
  const [now] = useState(() => Date.now());
  const [selected, setSelected] = useState(() => startOfDay(Date.now()));
  const [kindFilter, setKindFilter] = useState<RecordKind | "all">("all");
  const { date } = useLocalSearchParams<{ date?: string }>();

  useEffect(() => {
    if (date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(startOfDay(Number(date)));
    }
  }, [date]);

  const all = useMemo(
    () => recordsOnDay(source, selected, now),
    [source, selected, now],
  );
  const visible =
    kindFilter === "all" ? all : all.filter((r) => r.kind === kindFilter);
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
    const c: Record<string, number> = {
      all: all.length,
      T: 0,
      E: 0,
      N: 0,
      H: 0,
    };
    for (const r of all) c[r.kind]++;
    return c;
  }, [all]  );

  /**
   * Solicita confirmación antes de eliminar un registro.
   *
   * @param r Registro que se desea eliminar.
   */
  const confirmDelete = (r: RecordView) => {
    Alert.alert(
      "Eliminar registro",
      "¿Eliminar «" + r.title + "»? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => remove(r.kind, r.id),
        },
      ],
    );
  };

  /**
   * Muestra las acciones disponibles para un registro seleccionado.
   *
   * Desde este menú se puede abrir la edición o iniciar el flujo de eliminación.
   *
   * @param r Registro sobre el que se han solicitado las acciones.
   */
  const showActions = (r: RecordView) => {
    Alert.alert(r.title, undefined, [
      {
        text: "Editar",
        onPress: () =>
          router.push({
            pathname: "/edit",
            params: { kind: r.kind, id: r.id },
          }),
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => confirmDelete(r),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brand}>
            <LogoMark size={40} />
            <Text style={styles.brandText}>CRONIA</Text>
          </View>
          <Pressable
            style={styles.gearBtn}
            accessibilityLabel="Ajustes: categorías y apariencia"
            onPress={() => router.push("/settings")}
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
                <Text
                  style={[
                    styles.dayLetter,
                    { color: sel ? palette.onInk : palette.inkSoft },
                  ]}
                >
                  {DAY_LETTERS[i]}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: sel
                        ? palette.onInk
                        : future
                          ? palette.inkSoft
                          : palette.ink,
                    },
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
            const tint =
              id === "all" ? palette.muted : colors[id as RecordKind].tint;
            const dark =
              id === "all" ? palette.inkSoft : colors[id as RecordKind].dark;
            return (
              <Pressable
                key={id}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => setKindFilter(id)}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    { color: on ? palette.onInk : palette.ink },
                  ]}
                >
                  {label}
                </Text>
                <Text
                  style={[
                    styles.chipCount,
                    {
                      backgroundColor: on ? "rgba(255,255,255,0.18)" : tint,
                      color: on ? palette.onInk : dark,
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
        <Text style={styles.closedText}>
          {closed} cerrados · toca el icono para cambiar
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.listScroll}>
        <View style={styles.card}>
          {visible.length === 0 && (
            <Text style={styles.empty}>No hay registros de este tipo hoy.</Text>
          )}
          {visible.map((r, i) => {
            const t = tileColors(r.kind, r.statusIndex, colors);
            const canCycle = r.kind !== "N";
            const catNames = r.categoryIds
              .map((id) => names[id])
              .filter(Boolean);
            return (
              <Pressable
                key={r.kind + r.id + r.dateKey}
                style={[
                  styles.row,
                  i < visible.length - 1 && styles.rowDivider,
                ]}
                onPress={() => {
                  if (
                    r.kind === "T" ||
                    r.kind === "H" ||
                    r.kind === "E" ||
                    r.kind === "N"
                  ) {
                    router.push({
                      pathname: "/[id]",
                      params: { id: r.id, kind: r.kind },
                    });
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
                      t.dashed && {
                        borderWidth: 1.5,
                        borderStyle: "dashed",
                        borderColor: colors.H.dashed,
                      },
                    ]}
                  >
                    {r.kind === "T" && (
                      <TaskStateIcon
                        state={r.statusIndex}
                        size={25}
                        color={t.fg}
                      />
                    )}
                    {r.kind === "E" && (
                      <EventStateIcon
                        state={r.statusIndex}
                        size={23}
                        color={t.fg}
                      />
                    )}
                    {r.kind === "N" && (
                      <NoteStateIcon
                        state={r.statusIndex}
                        size={23}
                        color={t.fg}
                      />
                    )}
                    {r.kind === "H" && <HabitIcon size={23} color={t.fg} />}
                  </View>
                  {canCycle && (
                    <Pressable
                      style={styles.cycleBtn}
                      accessibilityLabel={"Cambiar estado de «" + r.title + "»"}
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
        onPress={() => router.push("/create")}
      >
        <PlusIcon size={26} color={palette.onInk} strokeWidth={2.4} />
      </Pressable>
    </SafeAreaView>
  );
}

/**
 * Crea los estilos de la pantalla a partir de la paleta activa.
 *
 * Se genera mediante una función para que todos los colores respondan al
 * cambio entre apariencia clara y oscura.
 *
 * @param palette Paleta de colores activa de la aplicación.
 * @returns Hoja de estilos usada por la pantalla de cronología.
 */
