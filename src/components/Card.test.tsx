import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from './Card';

describe('Card Component', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders with elevated variant by default', () => {
    const { getByText } = render(
      <Card>
        <Text>Elevated Card</Text>
      </Card>
    );
    expect(getByText('Elevated Card')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['elevated', 'outlined', 'filled'] as const;
    
    variants.forEach((variant) => {
      const { getByText } = render(
        <Card variant={variant}>
          <Text>{variant}</Text>
        </Card>
      );
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('handles onPress callback', () => {
    const { getByText } = render(
      <Card onPress={() => {}}>
        <Text>Pressable Card</Text>
      </Card>
    );
    expect(getByText('Pressable Card')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { getByText } = render(
      <Card style={{ marginTop: 10 }}>
        <Text>Styled Card</Text>
      </Card>
    );
    expect(getByText('Styled Card')).toBeTruthy();
  });
});
