import { describe, it, expect } from 'vitest';
import { withUpdates } from './clone';
import { Task } from '../models';

describe('withUpdates', () => {
  it('keeps class methods after updating', () => {
    const task = new Task('1', 'x', 1, 1, [], 'pending', Date.now() - 1000);
    const updated = withUpdates(task, { description: 'y' });
    expect(updated.description).toBe('y');
    expect(updated.isOverdue()).toBe(true);
    expect(task.description).toBe('x');
  });
});

