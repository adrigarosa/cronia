import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <EmptyState title="No items" />
    );
    expect(getByText('No items')).toBeTruthy();
  });

  it('renders with title and description', () => {
    const { getByText } = render(
      <EmptyState 
        title="No items" 
        description="Create your first item to get started"
      />
    );
    expect(getByText('No items')).toBeTruthy();
    expect(getByText('Create your first item to get started')).toBeTruthy();
  });

  it('renders action button when provided', () => {
    const { getByText } = render(
      <EmptyState
        title="No items"
        actionLabel="Create Item"
        onAction={() => {}}
      />
    );
    expect(getByText('No items')).toBeTruthy();
    expect(getByText('Create Item')).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { getByText } = render(
      <EmptyState
        title="No results"
        icon="search"
      />
    );
    expect(getByText('No results')).toBeTruthy();
  });

  it('applies custom style', () => {
    const { getByText } = render(
      <EmptyState
        title="Styled"
        style={{ padding: 20 }}
      />
    );
    expect(getByText('Styled')).toBeTruthy();
  });
});
