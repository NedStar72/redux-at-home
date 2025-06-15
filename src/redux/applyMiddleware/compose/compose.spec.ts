import { describe, it, expect } from 'bun:test';
import compose from '.';

const double = (x: number): number => x * 2;
const increment = (x: number): number => x + 1;
const toString = (x: number): string => `#${x}`;

describe('compose', () => {
  it('returns identity when no functions provided', () => {
    const fn = compose();
    expect(fn(5)).toBe(5);
    expect(fn('test')).toBe('test');
  });

  it('returns the same function when one function is provided', () => {
    const fn = compose(double);
    expect(fn).toBe(double);
    expect(fn(4)).toBe(8);
  });

  it('composes two functions correctly', () => {
    const fn = compose(double, increment);
    expect(fn(3)).toBe(8);
  });

  it('handles functions with different return types', () => {
    const fn = compose(toString, increment);
    expect(fn(7)).toBe('#8');
  });

  it('composes three functions correctly', () => {
    const fn = compose(toString, double, increment);
    expect(fn(2)).toBe('#6');
  });

  it('supports variadic arguments on the innermost function', () => {
    const sum = (a: number, b: number, c: number): number => a + b + c;
    const fn = compose(double, sum);
    expect(fn(1, 2, 3)).toBe(12);
  });

  it('composes a long chain of functions', () => {
    const fn = compose(
      (s: string) => s.length,
      toString,
      double,
      increment,
      (sum: number) => sum - 5,
    );
    expect(fn(3)).toBe(3);
  });
});
