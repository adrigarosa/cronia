export function withUpdates<T extends object>(instance: T, updates: Partial<T>): T {
  return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance, updates);
}

