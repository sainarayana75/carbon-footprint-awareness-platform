import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver to prevent Recharts layout errors in jsdom testing environment
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
