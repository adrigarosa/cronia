import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Badge from './Badge';

describe('Badge Component', () => {
  it('renders with label', () => {
    const { getByText } = render(
      <Badge label="Tag" />
    );
    expect(getByText('Tag')).toBeTruthy();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = render(
      <Badge label="Primary" />
    );
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'success', 'warning', 'danger', 'info'] as const;
    
    variants.forEach((variant) => {
      const { getByText } = render(
        <Badge label={`Badge ${variant}`} variant={variant} />
      );
      expect(getByText(`Badge ${variant}`)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach((size) => {
      const { getByText } = render(
        <Badge label={`Badge ${size}`} size={size} />
      );
      expect(getByText(`Badge ${size}`)).toBeTruthy();
    });
  });

  it('applies custom style', () => {
    const { getByText } = render(
      <Badge label="Styled" style={{ marginTop: 10 }} />
    );
    expect(getByText('Styled')).toBeTruthy();
  });
});
