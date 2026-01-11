import { describe, it, expect } from 'vitest';
import { cn, formatNumber, formatPercent, formatLatency } from '../utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('handles false conditionals', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('merges tailwind classes correctly (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('handles undefined and null values', () => {
    const result = cn('base', undefined, null, 'active');
    expect(result).toBe('base active');
  });
});

describe('formatNumber', () => {
  it('formats millions correctly', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
    expect(formatNumber(10000000)).toBe('10.0M');
  });

  it('formats thousands correctly', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(5500)).toBe('5.5K');
    expect(formatNumber(999999)).toBe('1000.0K');
  });

  it('returns number as-is for values under 1000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(999)).toBe('999');
  });
});

describe('formatPercent', () => {
  it('formats percentages correctly', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(50)).toBe('50%');
    expect(formatPercent(100)).toBe('100%');
  });

  it('handles decimal inputs', () => {
    expect(formatPercent(33.5)).toBe('33.5%');
  });
});

describe('formatLatency', () => {
  it('formats milliseconds to seconds when >= 1000', () => {
    expect(formatLatency(1000)).toBe('1.0s');
    expect(formatLatency(2500)).toBe('2.5s');
    expect(formatLatency(10000)).toBe('10.0s');
  });

  it('keeps milliseconds for values under 1000', () => {
    expect(formatLatency(0)).toBe('0ms');
    expect(formatLatency(500)).toBe('500ms');
    expect(formatLatency(999)).toBe('999ms');
  });
});
