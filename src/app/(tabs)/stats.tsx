import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useRecords } from '../../hooks/useRecords';
import { useAppearance, usePalette } from '../../theme/AppearanceContext';
import { fonts, Palette } from '../../theme/tokens';
import { computeStats, PERIOD_LABELS, Period } from '../../domain/stats';
import { TaskTypeIcon, EventTypeIcon, HabitIcon, CheckIcon, CrossIcon } from '../../components/icons';

const GRAY_TILE = '#EFEEF3';
const CAL_FILLS = ['#F2F1F6', '#F8D9BC', '#F0A866', '#E67E22'];
const CAL_HEAD = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const CAL_COL = '14.2857%';
const BAR_H = 128;

function fmt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function SeguimientoScreen() {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const { source, categories } = useRecords();
  const { colors } = useAppearance();
  const [now] = useState(() => Date.now());
  const [period, setPeriod] = useState<Period>('week');

  const stats = useMemo(() => computeStats(source, period, now), [source, period, now]);

  const namesMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of categories) m[c.id] = c.name;
    return m;
  }, [categories]);

  const max = Math.max(1, ...stats.series.map((b) => b.total));
  const cmax = Math.max(1, ...stats.cats.map((c) => c.v));
  const ringC = 2 * Math.PI * 52;
  const pct = stats.habits.pct;

  const mixItems: { key: 'T' | 'E' | 'N' | 'H'; label: string }[] = [
    { key: 'T', label: 'Tareas' },
    { key: 'E', label: 'Citas' },
    { key: 'N', label: 'Notas' },
    { key: 'H', label: 'Hábitos' },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Seguimiento</Text>
          <Text style={styles.periodLabel}>{stats.periodLabel}</Text>
        </View>

        <View style={styles.segments}>
          {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
            <Text
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.segment, period === p && styles.segmentOn]}
            >
              {PERIOD_LABELS[p]}
            </Text>
          ))}
        </View>

        {/* Total */}
        <View style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalNum}>{fmt(stats.total)}</Text>
            <Text style={styles.totalLabel}>registros en el periodo</Text>
          </View>
          <View style={styles.mixBar}>
            {mixItems.map((m) => (
              <View
                key={m.key}
                style={{
                  flex: Math.max(stats.mix[m.key], 0.0001),
                  backgroundColor: colors[m.key].base,
                }}
              />
            ))}
          </View>
          <View style={styles.mixGrid}>
            {mixItems.map((m) => (
              <View key={m.key} style={styles.mixItem}>
                <View style={[styles.mixDot, { backgroundColor: colors[m.key].base }]} />
                <Text style={styles.mixLabel}>{m.label}</Text>
                <Text style={styles.mixValue}>{fmt(stats.mix[m.key])}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actividad */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <Text style={styles.h2}>Actividad</Text>
            <Text style={styles.sectionHint}>{stats.seriesLabel}</Text>
          </View>
          <View style={styles.chart}>
            {stats.series.map((b) => (
              <View key={b.label} style={styles.chartCol}>
                <Text style={styles.chartTotal}>{fmt(b.total)}</Text>
                <View style={[styles.chartBar, b.current && styles.chartBarCur]}>
                  {(['T', 'E', 'N', 'H'] as const).map((k) => {
                    const h = Math.round((b.counts[k] / max) * BAR_H);
                    if (h <= 0) return null;
                    return (
                      <View
                        key={k}
                        style={{
                          height: h,
                          backgroundColor: colors[k].base,
                          borderTopLeftRadius: k === 'T' ? 6 : 0,
                          borderTopRightRadius: k === 'T' ? 6 : 0,
                        }}
                      />
                    );
                  })}
                </View>
                <Text style={[styles.chartLabel, b.current && styles.chartLabelCur]}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tareas */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <View style={[styles.headTile, { backgroundColor: colors.T.tint }]}>
              <TaskTypeIcon size={17} color={colors.T.dark} />
            </View>
            <Text style={[styles.h2, { flex: 1 }]}>Tareas</Text>
            <Text style={[styles.delta, { color: colors.T.dark }]}>{stats.tasks.deltaLabel}</Text>
          </View>
          <View style={styles.tiles2}>
            <View style={[styles.tile, { backgroundColor: palette.bg }]}>
              <Text style={styles.tileValue}>{fmt(stats.tasks.created)}</Text>
              <Text style={styles.tileLabel}>Creadas</Text>
            </View>
            <View style={[styles.tile, { backgroundColor: colors.T.dark }]}>
              <Text style={[styles.tileValue, { color: palette.white }]}>{fmt(stats.tasks.completed)}</Text>
              <Text style={[styles.tileLabel, { color: palette.white }]}>Culminadas</Text>
            </View>
            <View style={[styles.tile, { backgroundColor: colors.T.tint }]}>
              <Text style={[styles.tileValue, { color: colors.T.dark }]}>{fmt(stats.tasks.inProgress)}</Text>
              <Text style={[styles.tileLabel, { color: colors.T.dark }]}>En progreso</Text>
            </View>
            <View style={[styles.tile, { backgroundColor: palette.bg }]}>
              <Text style={styles.tileValue}>{fmt(stats.tasks.pending)}</Text>
              <Text style={styles.tileLabel}>Sin iniciar</Text>
            </View>
          </View>
          <View style={styles.deletedRow}>
            <Text style={styles.deletedLabel}>Eliminadas (aparte, no cuentan como fracaso)</Text>
            <Text style={styles.deletedValue}>{fmt(stats.tasks.deleted)}</Text>
          </View>
        </View>

        {/* Citas */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <View style={[styles.headTile, { backgroundColor: colors.E.tint }]}>
              <EventTypeIcon size={17} color={colors.E.dark} />
            </View>
            <Text style={[styles.h2, { flex: 1 }]}>Citas y eventos</Text>
            <Text style={styles.sectionHint}>
              {fmt(stats.events.done + stats.events.cancelled + stats.events.open)} previstos
            </Text>
          </View>
          <View style={styles.tiles3}>
            <View style={[styles.tile, { backgroundColor: colors.E.dark }]}>
              <Text style={[styles.tileValueSm, { color: palette.white }]}>{fmt(stats.events.done)}</Text>
              <Text style={[styles.tileLabel, { color: palette.white }]}>Realizados</Text>
            </View>
            <View style={[styles.tile, { backgroundColor: palette.bg }]}>
              <Text style={styles.tileValueSm}>{fmt(stats.events.cancelled)}</Text>
              <Text style={styles.tileLabel}>Cancelados</Text>
            </View>
            <View style={[styles.tile, { backgroundColor: colors.E.tint }]}>
              <Text style={[styles.tileValueSm, { color: colors.E.dark }]}>{fmt(stats.events.open)}</Text>
              <Text style={[styles.tileLabel, { color: colors.E.dark }]}>Por llegar o en curso</Text>
            </View>
          </View>
        </View>

        {/* Hábitos */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <View style={[styles.headTile, { backgroundColor: colors.H.tint }]}>
              <HabitIcon size={17} color={colors.H.dark} />
            </View>
            <Text style={[styles.h2, { flex: 1 }]}>Hábitos</Text>
          </View>

          <View style={styles.habitTop}>
            <View style={styles.ringWrap}>
              <Svg width={124} height={124} viewBox="0 0 124 124">
                <Circle cx={62} cy={62} r={52} stroke="#F2EEE9" strokeWidth={12} fill="none" />
                {pct !== null && (
                  <Circle
                    cx={62}
                    cy={62}
                    r={52}
                    stroke={colors.H.base}
                    strokeWidth={12}
                    fill="none"
                    strokeDasharray={`${((pct / 100) * ringC).toFixed(1)} ${ringC.toFixed(1)}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 62 62)`}
                  />
                )}
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.ringPct}>{pct === null ? 'Sin datos' : pct + ' %'}</Text>
                <Text style={styles.ringLabel}>cumplimiento</Text>
              </View>
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              {[
                ['Días previstos', stats.habits.plan],
                ['Realizados', stats.habits.done],
                ['No realizados', stats.habits.miss],
                ['Abiertos (hoy)', stats.habits.open],
              ].map(([label, v]) => (
                <View key={String(label)} style={styles.habitRow}>
                  <Text style={styles.habitRowLabel}>{label}</Text>
                  <Text style={styles.habitRowValue}>{fmt(Number(v))}</Text>
                </View>
              ))}
              <Text style={styles.tinyNote}>
                Realizados ÷ días previstos ya cerrados. Los abiertos no cuentan.
              </Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.subLabel}>Últimos 7 días</Text>
            <View style={styles.gridRow}>
              <View style={styles.gridName} />
              {stats.weekLabels.map((label, i) => (
                <Text key={i} style={[styles.gridHead, i === 6 && styles.gridHeadToday]}>
                  {label}
                </Text>
              ))}
            </View>
            {stats.habitGrid.map((row) => (
              <View key={row.id} style={styles.gridRow}>
                <Text numberOfLines={1} style={styles.gridName}>
                  {row.name}
                </Text>
                {row.cells.map((c, i) => (
                  <View
                    key={i}
                    style={[
                      styles.gridCell,
                      c.status === 'done' && { backgroundColor: colors.H.dark },
                      c.status === 'miss' && { backgroundColor: GRAY_TILE },
                      c.status === 'open' && {
                        borderWidth: 1.5,
                        borderStyle: 'dashed',
                        borderColor: colors.H.dark,
                      },
                    ]}
                  >
                    {c.status === 'done' && <CheckIcon size={14} color={palette.white} strokeWidth={3} />}
                    {c.status === 'miss' && <CrossIcon size={12} color={palette.inkSoft} strokeWidth={3} />}
                  </View>
                ))}
              </View>
            ))}
            <View style={styles.legend}>
              <LegendSwatch color={colors.H.dark} text="Realizado" />
              <LegendSwatch color={GRAY_TILE} text="No realizado" />
              <LegendSwatch dashed color={colors.H.dark} text="Por realizar" />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={styles.subLabel}>Calendario de {stats.calendarMonth}</Text>
            <View style={styles.calGrid}>
              {CAL_HEAD.map((w, i) => (
                <Text key={i} style={styles.calHead}>
                  {w}
                </Text>
              ))}
              {Array.from({ length: stats.calendarBlanks }, (_, i) => (
                <View key={'b' + i} style={styles.calCell} />
              ))}
              {stats.calendar.map((c) => (
                <View
                  key={c.day}
                  style={[
                    styles.calCell,
                    {
                      backgroundColor:
                        c.level === null ? palette.surface : CAL_FILLS[Math.min(c.level, 3)],
                    },
                    c.level === null && { borderWidth: 1, borderColor: palette.border },
                    c.today && { borderWidth: 2, borderColor: palette.ink },
                  ]}
                >
                  <Text style={[styles.calNum, c.level === null && { color: palette.inkSoft }]}>
                    {c.day}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.legend}>
              <Text style={styles.tinyNote}>0</Text>
              {CAL_FILLS.map((f) => (
                <View key={f} style={[styles.legendSwatch, { backgroundColor: f }]} />
              ))}
              <Text style={styles.tinyNote}>3 hábitos realizados</Text>
            </View>
          </View>
        </View>

        {/* Por categoría */}
        <View style={styles.card}>
          <Text style={styles.h2}>Por categoría</Text>
          {stats.cats.map((c) => (
            <View key={c.id} style={styles.catRow}>
              <Text numberOfLines={1} style={styles.catLabel}>
                {namesMap[c.id] ?? c.id}
              </Text>
              <View style={styles.catTrack}>
                <View style={{ width: `${Math.round((c.v / cmax) * 100)}%`, backgroundColor: palette.ink, height: '100%', borderRadius: 5 }} />
              </View>
              <Text style={styles.catValue}>{fmt(c.v)}</Text>
            </View>
          ))}
          <Text style={styles.tinyNote}>
            Un registro puede contar en varias categorías. Las cifras miden actividad registrada, no horas dedicadas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendSwatch({ color, text, dashed }: { color: string; text: string; dashed?: boolean }) {
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: dashed ? 'transparent' : color },
          dashed && { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color },
        ]}
      />
      <Text style={styles.tinyNote}>{text}</Text>
    </View>
  );
}

const makeStyles = (palette: Palette) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: 20, paddingBottom: 40, gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 4 },
  h1: { fontFamily: fonts.display, fontSize: 26, color: palette.ink },
  periodLabel: { fontSize: 13, color: palette.inkSoft },
  segments: {
    flexDirection: 'row',
    backgroundColor: palette.segmentTrack,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontFamily: fonts.bold,
    color: palette.inkSoft,
    overflow: 'hidden',
    lineHeight: 42,
  },
  segmentOn: {
    backgroundColor: palette.surface,
    color: palette.ink,
  },
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  totalNum: { fontFamily: fonts.display, fontSize: 40, lineHeight: 42, color: palette.ink },
  totalLabel: { fontSize: 14, color: palette.inkSoft },
  mixBar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2 },
  mixGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mixItem: { flexGrow: 1, flexBasis: '45%', flexDirection: 'row', alignItems: 'center', gap: 8 },
  mixDot: { width: 10, height: 10, borderRadius: 3 },
  mixLabel: { fontSize: 13, color: palette.ink, flex: 1 },
  mixValue: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  h2: { fontSize: 16, fontFamily: fonts.bold, color: palette.ink },
  sectionHint: { fontSize: 12, color: palette.inkSoft },
  headTile: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  delta: { fontSize: 12, fontFamily: fonts.bold },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 172 },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartTotal: { fontSize: 11, fontFamily: fonts.bold, color: palette.ink },
  chartBar: {
    width: '100%',
    maxWidth: 34,
    height: BAR_H,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
    gap: 1,
  },
  chartBarCur: { borderWidth: 2, borderColor: palette.ink },
  chartLabel: { fontSize: 11, color: palette.inkSoft },
  chartLabelCur: { fontWeight: '700', color: palette.ink },
  tiles2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tiles3: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: { flexGrow: 1, flexBasis: '45%', borderRadius: 14, padding: 12, gap: 2 },
  tileValue: { fontFamily: fonts.display, fontSize: 26, color: palette.ink },
  tileValueSm: { fontFamily: fonts.display, fontSize: 24, color: palette.ink },
  tileLabel: { fontSize: 12, fontFamily: fonts.semibold, color: palette.ink },
  deletedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: palette.bg,
    gap: 8,
  },
  deletedLabel: { fontSize: 13, color: palette.inkSoft, flex: 1 },
  deletedValue: { fontSize: 14, fontFamily: fonts.bold, color: palette.ink },
  habitTop: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  ringWrap: { width: 124, height: 124 },
  ringCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: { fontFamily: fonts.display, fontSize: 26, color: palette.ink },
  ringLabel: { fontSize: 11, color: palette.inkSoft },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  habitRowLabel: { fontSize: 13, color: palette.inkSoft },
  habitRowValue: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  tinyNote: { fontSize: 11, color: palette.inkSoft, lineHeight: 15 },
  subLabel: { fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
  gridRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  gridName: { width: 88, fontSize: 12, fontFamily: fonts.semibold, color: palette.ink },
  gridHead: { flex: 1, textAlign: 'center', fontSize: 11, color: palette.inkSoft, fontWeight: '600' },
  gridHeadToday: { fontWeight: '700', color: palette.ink },
  gridCell: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendSwatch: { width: 12, height: 12, borderRadius: 4 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  calHead: { width: CAL_COL, textAlign: 'center', fontSize: 11, fontFamily: fonts.bold, color: palette.inkSoft },
  calCell: {
    width: CAL_COL,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNum: { fontSize: 12, fontFamily: fonts.semibold, color: palette.ink },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catLabel: { width: 72, fontSize: 13, fontFamily: fonts.semibold, color: palette.ink },
  catTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: palette.muted, overflow: 'hidden' },
  catValue: { width: 40, textAlign: 'right', fontSize: 13, fontFamily: fonts.bold, color: palette.ink },
});
