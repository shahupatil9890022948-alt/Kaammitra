/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency } from '../format';

// Indian digit grouping must be correct without relying on Intl/Hermes ICU.
test('formatCurrency: small amounts', () => {
  assert.equal(formatCurrency(0), '₹0');
  assert.equal(formatCurrency(250), '₹250');
  assert.equal(formatCurrency(999), '₹999');
});

test('formatCurrency: thousands', () => {
  assert.equal(formatCurrency(1200), '₹1,200');
  assert.equal(formatCurrency(50000), '₹50,000');
});

test('formatCurrency: lakhs and crores (Indian grouping)', () => {
  assert.equal(formatCurrency(123456), '₹1,23,456');
  assert.equal(formatCurrency(1234567), '₹12,34,567');
  assert.equal(formatCurrency(10000000), '₹1,00,00,000');
});

test('formatCurrency: rounds and handles invalid input', () => {
  assert.equal(formatCurrency(250.4), '₹250');
  assert.equal(formatCurrency(250.6), '₹251');
  assert.equal(formatCurrency(NaN), '₹0');
});
