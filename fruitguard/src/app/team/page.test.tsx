import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import Team from './page';
import {useFetchFarmers} from '../hooks/useFetchFarmers';



jest.mock('../hooks/useFetchFarmers');

describe('Team component', () => {
  const mockFarmers = [
    { id: 1, first_name: 'James', last_name: 'Mwai', location: 'kigali', number_of_traps: 5, phone_number: '12345' },
    { id: 2, first_name: 'Jane', last_name: 'Wambui', location: null, number_of_traps: null, phone_number: null },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state', () => {
    (useFetchFarmers as jest.Mock).mockReturnValue({
      farmers: null,
      loading: true,
      error: null,
    });

    render(<Team />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error message on error', () => {
    (useFetchFarmers as jest.Mock).mockReturnValue({
      farmers: null,
      loading: false,
      error: 'Failed to load',
    });

    render(<Team />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('renders farmers table with data and handles null fields', async () => {
   (useFetchFarmers as jest.Mock).mockReturnValue({
      farmers: mockFarmers,
      loading: false,
      error: null,
    });

    render(<Team />);

    expect(screen.getByText('James Mwai')).toBeInTheDocument();
    expect(screen.getByText('Jane Wambui')).toBeInTheDocument();

    expect(screen.getByText('Kigali')).toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(2);
  });

  it('filters farmers by search input', () => {
    (useFetchFarmers as jest.Mock).mockReturnValue({
      farmers: mockFarmers,
      loading: false,
      error: null,
    });

    render(<Team />);

    const searchInput = screen.getByPlaceholderText('Search by name,location,phone number');
    fireEvent.change(searchInput, { target: { value: 'james' } });

    expect(screen.getByText('James Mwai')).toBeInTheDocument();
    expect(screen.queryByText('Jane Wambui')).not.toBeInTheDocument();
  });

  it('handles pagination controls', () => {
    const manyFarmers = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      first_name: `Farmer${i}`,
      last_name: `Last${i}`,
      location: 'loc',
      number_of_traps: i,
      phone_number: `000${i}`,
    }));

    (useFetchFarmers as jest.Mock).mockReturnValue({
      farmers: manyFarmers,
      loading: false,
      error: null,
    });

    render(<Team />);
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  });
});
