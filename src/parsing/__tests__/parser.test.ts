/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInput } from '../parser';

/**
 * Covers the five core voice examples from the product spec plus a few edge
 * cases. These assert the intent classification and the most important
 * extracted slots — the heart of the "invisible AI".
 */

test('reminder: "Kal light bill bharna yaad dilana"', () => {
  const r = parseInput('Kal light bill bharna yaad dilana');
  assert.equal(r.kind, 'reminder');
  assert.equal(r.category, 'bills');
  assert.ok(r.dueAt && r.dueAt > Date.now(), 'should resolve a future due date (kal = tomorrow)');
});

test('expense: "Aaj 250 petrol me gaya"', () => {
  const r = parseInput('Aaj 250 petrol me gaya');
  assert.equal(r.kind, 'expense');
  assert.equal(r.amount, 250);
  assert.equal(r.category, 'travel');
});

test('udhaar: "Ramesh ko 1200 udhaar diya"', () => {
  const r = parseInput('Ramesh ko 1200 udhaar diya');
  assert.equal(r.kind, 'udhaar');
  assert.equal(r.amount, 1200);
  assert.equal(r.personName, 'Ramesh');
  assert.equal(r.direction, 'given');
});

test('reminder: "Sunday ko supplier ko payment yaad dilana"', () => {
  const r = parseInput('Sunday ko supplier ko payment yaad dilana');
  assert.equal(r.kind, 'reminder');
  assert.equal(r.category, 'payments');
  assert.ok(r.dueAt && r.dueAt > Date.now(), 'should resolve next Sunday');
});

test('document task: "Job ke documents ready karne hain"', () => {
  const r = parseInput('Job ke documents ready karne hain');
  assert.equal(r.kind, 'document_task');
  assert.ok((r.title ?? '').length > 0);
});

test('hindi reminder: "कल बिजली बिल भरना याद दिलाना"', () => {
  const r = parseInput('कल बिजली बिल भरना याद दिलाना');
  assert.equal(r.kind, 'reminder');
  assert.equal(r.category, 'bills');
  // "कल" (Devanagari "tomorrow") must resolve a future date despite ASCII \b.
  assert.ok(r.dueAt && r.dueAt > Date.now(), 'Devanagari date word should resolve a due date');
});

test('marathi reminder date: "उद्या डॉक्टर ला भेटायचं आठवण कर"', () => {
  const r = parseInput('उद्या डॉक्टर ला भेटायचं आठवण कर');
  assert.equal(r.kind, 'reminder');
  assert.ok(r.dueAt && r.dueAt > Date.now(), 'Marathi "उद्या" should resolve tomorrow');
});

test('marathi expense: "आज 120 भाजी खर्च झाले"', () => {
  const r = parseInput('आज 120 भाजी खर्च झाले');
  assert.equal(r.kind, 'expense');
  assert.equal(r.amount, 120);
});

test('udhaar received direction: "Anita se 500 liya"', () => {
  const r = parseInput('Anita se 500 udhaar liya');
  assert.equal(r.kind, 'udhaar');
  assert.equal(r.direction, 'received');
  assert.equal(r.amount, 500);
});

test('reminder without time asks one clarification', () => {
  const r = parseInput('supplier ko payment yaad dilana');
  assert.equal(r.kind, 'reminder');
  assert.equal(r.dueAt, null);
  assert.ok(r.clarification, 'should ask a single clarification when time missing');
});

test('amount with rupee symbol parses', () => {
  const r = parseInput('₹1,500 grocery kharch');
  assert.equal(r.kind, 'expense');
  assert.equal(r.amount, 1500);
});
