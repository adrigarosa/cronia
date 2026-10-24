import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { Text } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
  },
}));

describe('Button', () => {
  it('renders label and handles press', async () => {
    const onPress = jest.fn();
    await render(<Button label="Click me" onPress={onPress} />);
    await fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Off" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByText('Off'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Badge', () => {
  it('renders label', async () => {
    await render(<Badge label="Nuevo" />);
    expect(screen.getByText('Nuevo')).toBeTruthy();
  });
});

describe('Card', () => {
  it('renders children', async () => {
    await render(
      <Card>
        <Text>Contenido</Text>
      </Card>
    );
    expect(screen.getByText('Contenido')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('renders title', async () => {
    await render(<EmptyState title="Sin registros" />);
    expect(screen.getByText('Sin registros')).toBeTruthy();
  });
});
