import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import randomString from '.';

describe('randomString', () => {
  let originalMathRandom: typeof Math.random;

  beforeEach(() => {
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  it('should produce a dotted string from characters of base-36 random', () => {
    Math.random = () => 0.123456789;
    const result = randomString();
    expect(result).toBe('x.j.y.l.r.z');
  });

  it('should only contain lowercase letters, digits, and dots', () => {
    const result = randomString();
    expect(result).toMatch(/^[a-z0-9](?:\.[a-z0-9])*$/);
  });

  it('should produce different strings on consecutive calls (extremely likely)', () => {
    const a = randomString();
    const b = randomString();
    expect(a).not.toBe(b);
  });
});
