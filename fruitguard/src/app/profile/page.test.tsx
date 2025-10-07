import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from './page';

jest.mock('../hooks/useFetchProfile');
jest.mock('../utils/updateProfile');

import useProfile from '../hooks/useFetchProfile';
import { updateProfile } from '../utils/updateProfile';

const mockedUseProfile = useProfile as jest.Mock;
const mockedUpdateProfile = updateProfile as jest.Mock;

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mockLocalStorage.setItem('token', 'fake-jwt-token');
  });

  test('shows loading state when loading profile', () => {
    mockedUseProfile.mockReturnValue({ profile: null, loading: true, error: null });
    render(<ProfilePage />);
    expect(screen.getByText(/Loading profile…/i)).toBeInTheDocument();
  });

  test('shows error message when profile fetch error occurs', () => {
    mockedUseProfile.mockReturnValue({ profile: null, loading: false, error: 'Failed to load profile' });
    render(<ProfilePage />);
    expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument();
  });

  test('renders profile data correctly', () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '/profile.jpg',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    expect(screen.getByText('Esther Nyambura')).toBeInTheDocument();
    expect(screen.getByText('Agrovet')).toBeInTheDocument();
    expect(screen.getByText('esthernyambura@example.com')).toBeInTheDocument();
  });

  test('renders correctly when some profile fields are null', () => {
    mockedUseProfile.mockReturnValue({
      profile: { first_name: null, last_name: null, email: null, profile_image: null, user_type: null },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
  });

  test('updates form input values on change', async () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    await userEvent.clear(screen.getByLabelText(/First name/i));
    await userEvent.type(screen.getByLabelText(/First name/i), 'Jane');
    expect(screen.getByLabelText(/First name/i)).toHaveValue('Jane');
  });

  test('shows updating message and calls updateProfile on form submit', async () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    mockedUpdateProfile.mockResolvedValue(undefined);
    render(<ProfilePage />);
  });

  test('shows update error message on submission failure', async () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    mockedUpdateProfile.mockRejectedValue(new Error('Update failed'));
    render(<ProfilePage />);
  });
});
