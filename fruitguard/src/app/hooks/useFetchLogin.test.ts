import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchLogin } from '../utils/fetchLogin';
import useFetchLogin from './useFetchLogin';

jest.mock('../utils/fetchLogin');
describe('useFetchLogin', () => {
  const userCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };
  const mockResult = { token: 'mock-token' };

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('initializes with correct state', () => {
    const { result } = renderHook(() => useFetchLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.login).toEqual(expect.any(Function));
  });

  it('handles a successful login', async () => {
    (fetchLogin as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useFetchLogin());
    let loginResult;

    await act(async () => {
      loginResult = await result.current.login(userCredentials.email, userCredentials.password);
    });

    expect(fetchLogin).toHaveBeenCalledWith(userCredentials.email, userCredentials.password);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(loginResult).toBe(mockResult);
  });

  it('handles a login failure', async () => {
    const errorMessage = 'Login failed';
    (fetchLogin as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchLogin());
    let loginResult;

    await act(async () => {
      loginResult = await result.current.login(userCredentials.email, userCredentials.password);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe(errorMessage);
    expect(loginResult).toBe(null);
  });

  it('sets loading state during login', async () => {
    const promise = new Promise<typeof mockResult>(resolve => setTimeout(() => resolve(mockResult), 100));
    (fetchLogin as jest.Mock).mockImplementation(() => promise);
    const { result } = renderHook(() => useFetchLogin());
    act(() => {
      result.current.login(userCredentials.email, userCredentials.password);
    });
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  })});