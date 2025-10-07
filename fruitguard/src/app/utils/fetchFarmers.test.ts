import { fetchFarmers } from "./fetchFarmers"; 

const baseUrl = 'api/user';

describe('fetchFarmers', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches farmers list successfully', async () => {
    const mockData = [{ id: 1, name: 'Joy' }, { id: 2, name: 'Mwandia' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await fetchFarmers();

    expect(fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual(mockData);
  });

  it('returns null if backend returns empty array', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await fetchFarmers();

    expect(fetch).toHaveBeenCalledWith(baseUrl);
    expect(result).toEqual([]);
  });

  it('throws an error when response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Server error',
    });
    await expect(fetchFarmers()).rejects.toThrow(
      "Something went wrong while loading the farmers list: couldn't load the farmers list:Server error"
    );
  });

  it('throws an error on network failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchFarmers()).rejects.toThrow(
      'Something went wrong while loading the farmers list: Network Error'
    )})});
