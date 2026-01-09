import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHeaderData, getFooterData, getPagesData } from './layoutLoaders';
import { fetchData } from './api/base';
import { HARDCODED_DATA } from '@/consts/layout';

vi.mock('./api/base', () => ({
  fetchData: vi.fn(),
}));

vi.mock('@ryankshaw/next-runtime-env', () => ({
  env: (key: string) => {
    if (key === 'NEXT_PUBLIC_STRAPI_API_URL') return 'http://localhost:1337';
    return undefined;
  },
}));

describe('layoutLoaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getHeaderData', () => {
    it('should return API data when fetch is successful', async () => {
      const mockHeaderData = { logo: { url: '/test.png' }, links: [] };
      vi.mocked(fetchData).mockResolvedValueOnce({ header: mockHeaderData });

      const result = await getHeaderData('pl');
      
      expect(result).toEqual(mockHeaderData);
      expect(fetchData).toHaveBeenCalledWith(expect.stringContaining('/api/global-page'));
      expect(fetchData).toHaveBeenCalledWith(expect.stringContaining('locale=pl'));
    });

    it('should return fallback data when API fails', async () => {
      vi.mocked(fetchData).mockRejectedValueOnce(new Error('API Error'));

      const result = await getHeaderData('pl');
      
      expect(result).toEqual(HARDCODED_DATA['pl'].header);
    });

    it('should return fallback data when API returns no header', async () => {
      vi.mocked(fetchData).mockResolvedValueOnce({});

      const result = await getHeaderData('en');
      
      expect(result).toEqual(HARDCODED_DATA['en'].header);
    });
  });

  describe('getFooterData', () => {
    it('should return API data when fetch is successful', async () => {
      const mockFooterData = { universityLogo: { url: '/uni.png' }, sections: [] };
      vi.mocked(fetchData).mockResolvedValueOnce({ footer: mockFooterData });

      const result = await getFooterData('pl');
      
      expect(result).toEqual(mockFooterData);
      expect(fetchData).toHaveBeenCalledWith(expect.stringContaining('/api/global-page'));
    });

    it('should return fallback data when API fails', async () => {
      vi.mocked(fetchData).mockRejectedValueOnce(new Error('API Error'));

      const result = await getFooterData('pl');
      
      expect(result).toEqual(HARDCODED_DATA['pl'].footer);
    });
  });

  describe('getPagesData', () => {
    it('should return pages list when fetch is successful', async () => {
      const mockPages = [{ id: 1, name: 'Home', slug: 'home' }];
      vi.mocked(fetchData).mockResolvedValueOnce({ data: mockPages });

      const result = await getPagesData('pl');
      
      expect(result).toEqual(mockPages);
      expect(fetchData).toHaveBeenCalledWith(expect.stringContaining('/api/pages'));
    });

    it('should return empty array when API fails', async () => {
      vi.mocked(fetchData).mockRejectedValueOnce(new Error('API Error'));

      const result = await getPagesData('pl');
      
      expect(result).toEqual([]);
    });

    it('should return empty array when API returns no data', async () => {
      vi.mocked(fetchData).mockResolvedValueOnce(null);

      const result = await getPagesData('pl');
      
      expect(result).toEqual([]);
    });
  });
});
