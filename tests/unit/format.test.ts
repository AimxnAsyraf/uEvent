import { expect, test } from 'vitest';
import { formatDateTime, formatRM } from '@/lib/format';

test('formatDateTime shows Malaysia time', () => {
  expect(formatDateTime('2026-11-12T12:00:00Z')).toBe('12 Nov 2026, 8:00 PM');
});

test('formatDateTime accepts a Date', () => {
  expect(formatDateTime(new Date('2026-11-12T00:30:00Z'))).toBe('12 Nov 2026, 8:30 AM');
});

test('formatRM formats money', () => {
  expect(formatRM(1250)).toBe('RM 1,250.00');
  expect(formatRM(0)).toBe('RM 0.00');
  expect(formatRM(9999999.99)).toBe('RM 9,999,999.99');
});
