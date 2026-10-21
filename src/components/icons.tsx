import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function Outline({
  size = 20,
  color = '#1C1B29',
  strokeWidth = 2,
  children,
  round = true,
}: IconProps & { children: React.ReactNode; round?: boolean }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={round ? 'round' : undefined}
      strokeLinejoin={round ? 'round' : undefined}
    >
      {children}
    </Svg>
  );
}

export function LogoMark({
  size = 40,
  ink = '#1C1B29',
  strokeWidth = 7,
}: {
  size?: number;
  ink?: string;
  strokeWidth?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Path
        d="M26 8 H64 L86 30 V80 A12 12 0 0 1 74 92 H26 A12 12 0 0 1 14 80 V20 A12 12 0 0 1 26 8 Z"
        stroke={ink}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M64 8 V24 A6 6 0 0 0 70 30 H86"
        stroke={ink}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M27 22 H48" stroke={ink} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Rect x={25} y={64} width={9} height={14} rx={2.5} fill="#9B59B6" />
      <Rect x={37} y={56} width={9} height={22} rx={2.5} fill="#2980B9" />
      <Rect x={49} y={48} width={9} height={30} rx={2.5} fill="#16A085" />
      <Rect x={61} y={38} width={9} height={40} rx={2.5} fill="#E67E22" />
    </Svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Outline>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M12 5v14M5 12h14" />
    </Outline>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M18 6L6 18M6 6l12 12" />
    </Outline>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M15 18l-6-6 6-6" />
    </Outline>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M6 9l6 6 6-6" />
    </Outline>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M5 12.5l4.5 4.5L19 7" />
    </Outline>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M7 7l10 10M17 7L7 17" />
    </Outline>
  );
}

export function ListNavIcon(props: IconProps) {
  return (
    <Outline {...props} round>
      <Path d="M9 6h12M9 12h12M9 18h12" />
      <Circle cx={4} cy={6} r={1.4} />
      <Circle cx={4} cy={12} r={1.4} />
      <Circle cx={4} cy={18} r={1.4} />
    </Outline>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Circle cx={11} cy={11} r={7} />
      <Path d="M20 20l-3.5-3.5" />
    </Outline>
  );
}

export function NoResultsIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Circle cx={11} cy={11} r={7} />
      <Path d="M20 20l-3.5-3.5M8.5 11h5" />
    </Outline>
  );
}

export function BarsNavIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M5 20V12M12 20V5M19 20v-9" />
    </Outline>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </Outline>
  );
}

export function ArchiveIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Rect x={3} y={4} width={18} height={5} rx={1} />
      <Path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" />
    </Outline>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Outline {...props} strokeWidth={props.strokeWidth ?? 2.2}>
      <Path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <Circle cx={7.5} cy={7.5} r={1.2} />
    </Outline>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </Outline>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </Outline>
  );
}

export function TaskTypeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M9 11l3 3L22 4" />
      <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </Outline>
  );
}

export function NoteTypeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Path d="M14 2v6h6M16 13H8M16 17H8" />
    </Outline>
  );
}

export function EventTypeIcon(props: IconProps) {
  return (
    <Outline {...props}>
      <Rect x={3} y={4} width={18} height={18} rx={2} />
      <Path d="M16 2v4M8 2v4M3 10h18" />
    </Outline>
  );
}

export function HabitIcon(props: IconProps) {
  return (
    <Outline {...props} strokeWidth={props.strokeWidth ?? 2}>
      <Path d="M17 1l4 4-4 4" />
      <Path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <Path d="M7 23l-4-4 4-4" />
      <Path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Outline>
  );
}

export function TaskStateIcon({
  state,
  size = 25,
  color = '#1C1B29',
}: {
  state: number;
  size?: number;
  color?: string;
}) {
  const common = { width: size, height: size, viewBox: '0 0 24 24' };
  if (state === 2) {
    return (
      <Svg {...common} fill={color} stroke={color} strokeWidth={2.2}>
        <Rect x={5} y={5} width={14} height={14} rx={2.5} />
      </Svg>
    );
  }
  return (
    <Svg
      {...common}
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap={state === 3 ? 'round' : undefined}
    >
      <Rect x={5} y={5} width={14} height={14} rx={2.5} />
      {state === 1 && (
        <Path
          d="M5.8 18.2 L18.2 5.8 V16.5 A1.7 1.7 0 0 1 16.5 18.2 Z"
          fill={color}
          stroke="none"
        />
      )}
      {state === 3 && <Path d="M2.5 12h19" />}
    </Svg>
  );
}

export function EventStateIcon({
  state,
  size = 23,
  color = '#1C1B29',
}: {
  state: number;
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x={3} y={4} width={18} height={18} rx={2} />
      {state === 0 && <Path d="M16 2v4M8 2v4M3 10h18" />}
      {state === 1 && (
        <>
          <Path d="M16 2v4M8 2v4M3 10h18" />
          <Circle cx={12} cy={16} r={2.6} fill={color} stroke="none" />
        </>
      )}
      {state === 2 && <Path d="M16 2v4M8 2v4M3 10h18M8.5 16l2.5 2.5 4.5-4.5" />}
      {state === 3 && <Path d="M16 2v4M8 2v4M3 10h18M9.5 13.5l5 5M14.5 13.5l-5 5" />}
    </Svg>
  );
}

export function NoteStateIcon({
  state,
  size = 23,
  color = '#1C1B29',
}: {
  state: number;
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {state === 0 && (
        <>
          <Path d="M9 18h6M10 22h4" />
          <Path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
        </>
      )}
      {state === 1 && (
        <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      )}
      {state === 2 && (
        <>
          <Path d="M12 20h9" />
          <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </>
      )}
    </Svg>
  );
}
