import { renderHook, act } from '@testing-library/react';
import { fetchRegister } from '../utils/fetchRegister';
import useFetchRegister from './useFetchRegister';

jest.mock('../utils/fetchRegister');
const mockFetchRegister = fetchRegister as jest.MockedFunction<typeof fetchRegister>;

describe('useFetchRegister', () => {
  const userData = { id: 1, first_name: '', last_name: '', email: '', user_type:'', phone_number: '', password: '' };
  const mockResult = { token: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful registration', async () => {

    mockFetchRegister.mockResolvedValueOnce(mockResult);
    const { result } = renderHook(() => useFetchRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(userData);
    });

    expect(mockFetchRegister).toHaveBeenCalledWith(userData);
    expect(registerResult).toBe(mockResult);
    expect(result.current).toMatchObject({ loading: false, error: null });
  });

  it('handles registration failure', async () => {
    mockFetchRegister.mockRejectedValueOnce(new Error('Registration failed'));
    const { result } = renderHook(() => useFetchRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(userData);
    });

    expect(mockFetchRegister).toHaveBeenCalledWith(userData);
    expect(registerResult).toBe(null);
    expect(result.current).toMatchObject({ loading: false, error: 'Registration failed' });
  });
  });

