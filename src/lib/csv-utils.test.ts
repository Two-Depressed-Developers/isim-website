import { describe, it, expect } from 'vitest';
import { parseCSV } from './csv-utils';

describe('parseCSV', () => {
  it('should parse simple CSV', () => {
    const input = 'a,b,c\n1,2,3';
    const expected = [['a', 'b', 'c'], ['1', '2', '3']];
    expect(parseCSV(input)).toEqual(expected);
  });

  it('should handle quoted values with commas', () => {
    const input = 'a,"b,c",d\n1,2,3';
    const expected = [['a', 'b,c', 'd'], ['1', '2', '3']];
    expect(parseCSV(input)).toEqual(expected);
  });

  it('should handle escaped quotes', () => {
    const input = 'a,"b""c",d\n1,2,3';
    const expected = [['a', 'b"c', 'd'], ['1', '2', '3']];
    expect(parseCSV(input)).toEqual(expected);
  });

  it('should handle multiple line endings', () => {
    const input = 'a,b\r\n1,2\n3,4';
    const expected = [['a', 'b'], ['1', '2'], ['3', '4']];
    expect(parseCSV(input)).toEqual(expected);
  });

  it('should ignore empty lines', () => {
    const input = 'a,b\n\n1,2\n\n\n';
    const expected = [['a', 'b'], ['1', '2']];
    expect(parseCSV(input)).toEqual(expected);
  });
});
