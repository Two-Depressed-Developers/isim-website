import { describe, it, expect } from 'vitest';
import { getStrapiMedia, flattenAttributes, getEmailForDev } from './utils';

import { vi } from 'vitest';

vi.mock('@ryankshaw/next-runtime-env', () => ({
  env: (key: string) => {
    if (key === 'NEXT_PUBLIC_STRAPI_API_URL') return 'http://localhost:1337';
    return undefined;
  },
}));

describe('getStrapiMedia', () => {
  it('should return null for null input', () => {
    expect(getStrapiMedia(null)).toBeNull();
  });

  it('should return data URL as is', () => {
    const dataUrl = 'data:image/png;base64,abc';
    expect(getStrapiMedia(dataUrl)).toBe(dataUrl);
  });

  it('should return absolute URL as is', () => {
    const absUrl = 'https://example.com/image.png';
    expect(getStrapiMedia(absUrl)).toBe(absUrl);
  });

  it('should prepend Strapi URL for relative paths', () => {
    const relPath = '/uploads/test.png';
    expect(getStrapiMedia(relPath)).toBe('http://localhost:1337/uploads/test.png');
  });
});

describe('flattenAttributes', () => {
  it('should flatten deep Strapi data structures', () => {
    const data = {
      id: 1,
      attributes: {
        title: 'Test',
        nested: {
          data: {
            id: 2,
            attributes: {
              name: 'Nested'
            }
          }
        },
        list: {
          data: [
            { id: 3, attributes: { item: '1' } },
            { id: 4, attributes: { item: '2' } }
          ]
        }
      }
    };

    const expected = {
      id: 1,
      title: 'Test',
      nested: {
        id: 2,
        name: 'Nested'
      },
      list: {
        data: [
          { id: 3, item: '1' },
          { id: 4, item: '2' }
        ]
      }
    };

    expect(flattenAttributes(data)).toEqual(expected);
  });

  it('should return scalar values as is', () => {
    expect(flattenAttributes(123)).toBe(123);
    expect(flattenAttributes('string')).toBe('string');
    expect(flattenAttributes(null)).toBeNull();
  });
});

describe('getEmailForDev', () => {
  it('should return development email when in development mode and RESEND_DEV_EMAIL is set', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('RESEND_DEV_EMAIL', 'dev@example.com');
    
    expect(getEmailForDev('user@example.com')).toBe('dev@example.com');
    
    vi.unstubAllEnvs();
  });

  it('should return original email if not in development mode', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    expect(getEmailForDev('user@example.com')).toBe('user@example.com');
    
    vi.unstubAllEnvs();
  });
});
