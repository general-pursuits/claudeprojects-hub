import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { __mocks } from '@supabase/supabase-js';
import App from './App';

// react-scripts runs jest with resetMocks, so the chain is re-wired in beforeEach.
jest.mock('@supabase/supabase-js', () => {
  const __mocks = {
    from: jest.fn(), select: jest.fn(), limit: jest.fn(),
    single: jest.fn(), update: jest.fn(), neq: jest.fn(),
  };
  return { __mocks, createClient: () => ({ from: (...args) => __mocks.from(...args) }) };
});

const { from, select, limit, single, update, neq } = __mocks;
const originalConsoleError = console.error;

beforeEach(() => {
  from.mockImplementation(() => ({ select, update }));
  select.mockImplementation(() => ({ limit }));
  limit.mockImplementation(() => ({ single }));
  update.mockImplementation(() => ({ neq }));
  single.mockResolvedValue({ data: { current_bid: 120 }, error: null });
  neq.mockResolvedValue({ error: null });
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

test('renders the exhibition placard', async () => {
  render(<App />);
  expect(screen.getByText('The Indigo Transition')).toBeInTheDocument();
  expect(screen.getByText(/AURA TAG: COSMIC INDIGO/)).toBeInTheDocument();
  await waitFor(() => expect(single).toHaveBeenCalled());
});

test('shows the current bid loaded from the ledger', async () => {
  render(<App />);
  expect(await screen.findByText('$120 USD')).toBeInTheDocument();
  expect(from).toHaveBeenCalledWith('auction_item');
  expect(select).toHaveBeenCalledWith('current_bid');
});

test('falls back to $0 and logs when the ledger read fails', async () => {
  single.mockResolvedValue({ data: null, error: { message: 'offline' } });
  render(<App />);
  await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error reading ledger:', { message: 'offline' }));
  expect(screen.getByText('$0 USD')).toBeInTheDocument();
});

test('placing a bid raises the price and writes it back to the ledger', async () => {
  render(<App />);
  await screen.findByText('$120 USD');

  fireEvent.click(screen.getByRole('button', { name: /place bid/i }));

  expect(await screen.findByText('$135 USD')).toBeInTheDocument();
  expect(update).toHaveBeenCalledWith({ current_bid: 135 });
  expect(neq).toHaveBeenCalledWith('current_bid', 0);
});

test('keeps the optimistic bid but logs when the ledger write fails', async () => {
  neq.mockResolvedValue({ error: { message: 'rejected' } });
  render(<App />);
  await screen.findByText('$120 USD');

  fireEvent.click(screen.getByRole('button', { name: /place bid/i }));

  expect(await screen.findByText('$135 USD')).toBeInTheDocument();
  await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error updating ledger:', { message: 'rejected' }));
});

test('renders the countdown in HH:MM:SS', async () => {
  render(<App />);
  expect(screen.getByText('01:00:00')).toBeInTheDocument();
  await waitFor(() => expect(single).toHaveBeenCalled());
});
