import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { usePalette } from '../theme/AppearanceContext';
import { ChevronDownIcon, CheckIcon } from './icons';
import { makeStyles } from '../styles/components/Select.styles';

export interface SelectOption {
  id: string;
  label: string;
}

/**
 * Desplegable con el estilo de la plantilla: campo de 44px con chevron
 * y lista de opciones en un modal.
 */
export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: SelectOption[];
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);
  const current = options.find((o) => o.id === value);

  return (
    <>
      <Pressable style={styles.field} onPress={() => setOpen(true)} accessibilityRole="button">
        <Text numberOfLines={1} style={styles.value}>
          {current?.label ?? ''}
        </Text>
        <ChevronDownIcon size={16} color={palette.inkSoft} strokeWidth={2.4} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {options.map((o) => {
              const on = o.id === value;
              return (
                <Pressable
                  key={o.id}
                  style={[styles.row, on && styles.rowOn]}
                  onPress={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.rowText, on && styles.rowTextOn]}>{o.label}</Text>
                  {on && <CheckIcon size={16} color={palette.ink} strokeWidth={2.6} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
