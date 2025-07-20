import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import theme from '@/lib/theme';
import GroupForm from './GroupForm';

// Mock fetch for API calls
global.fetch = jest.fn();

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('GroupForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders all form fields', () => {
    renderWithProviders(<GroupForm />);
    
    expect(screen.getByText(/職業/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/等級/i)).toBeInTheDocument();
    expect(screen.getByText(/地圖/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/開始時間/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/結束時間/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/遊戲 ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Discord ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /建立組隊/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GroupForm />);
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/職業是必填的/i)).toBeInTheDocument();
      expect(screen.getByText(/等級是必填的/i)).toBeInTheDocument();
      expect(screen.getByText(/地圖是必填的/i)).toBeInTheDocument();
      expect(screen.getByText(/遊戲 ID 是必填的/i)).toBeInTheDocument();
    });
  });

  it('validates level must be at least 70', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GroupForm />);
    
    const levelInput = screen.getByLabelText(/等級/i);
    await user.type(levelInput, '69');
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/等級必須至少為 70/i)).toBeInTheDocument();
    });
  });

  it('validates end time must be after start time', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GroupForm />);
    
    // Set start time to future and end time to past
    const startTimeInput = screen.getByLabelText(/開始時間/i);
    const endTimeInput = screen.getByLabelText(/結束時間/i);
    
    await user.type(startTimeInput, '2025-07-15T22:00');
    await user.type(endTimeInput, '2025-07-15T20:00');
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/結束時間必須晚於開始時間/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      success: true,
      data: { id: '1', job: '龍騎士', level: 85 }
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    renderWithProviders(<GroupForm />);
    
    // Fill form with valid data
    const jobSelect = screen.getByRole('combobox', { name: /職業/i });
    await user.click(jobSelect);
    await user.click(screen.getByText('龍騎士'));
    
    const levelInput = screen.getByLabelText(/等級/i);
    await user.clear(levelInput);
    await user.type(levelInput, '85');
    
    const mapSelect = screen.getByRole('combobox', { name: /地圖/i });
    await user.click(mapSelect);
    await user.click(screen.getByText('DT'));
    
    await user.type(screen.getByLabelText(/開始時間/i), '2025-07-15T20:00');
    await user.type(screen.getByLabelText(/結束時間/i), '2025-07-15T22:00');
    await user.type(screen.getByLabelText(/遊戲 ID/i), 'TestPlayer123');
    await user.type(screen.getByLabelText(/Discord ID/i), 'test#1234');
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: '龍騎士',
          level: 85,
          map: 'DT',
          startTime: '2025-07-15T20:00:00.000Z',
          endTime: '2025-07-15T22:00:00.000Z',
          gameId: 'TestPlayer123',
          discordId: 'test#1234',
        }),
      });
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock slow API response
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    renderWithProviders(<GroupForm />);
    
    // Fill form with valid data
    const jobSelect = screen.getByRole('combobox', { name: /職業/i });
    await user.click(jobSelect);
    await user.click(screen.getByText('龍騎士'));
    
    const levelInput = screen.getByLabelText(/等級/i);
    await user.clear(levelInput);
    await user.type(levelInput, '85');
    
    const mapSelect = screen.getByRole('combobox', { name: /地圖/i });
    await user.click(mapSelect);
    await user.click(screen.getByText('DT'));
    
    await user.type(screen.getByLabelText(/開始時間/i), '2025-07-15T20:00');
    await user.type(screen.getByLabelText(/結束時間/i), '2025-07-15T22:00');
    await user.type(screen.getByLabelText(/遊戲 ID/i), 'TestPlayer123');
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/建立中.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles API error gracefully', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Server error'
      }),
    });
    
    renderWithProviders(<GroupForm />);
    
    // Fill form with valid data
    const jobSelect = screen.getByRole('combobox', { name: /職業/i });
    await user.click(jobSelect);
    await user.click(screen.getByText('龍騎士'));
    
    const levelInput = screen.getByLabelText(/等級/i);
    await user.clear(levelInput);
    await user.type(levelInput, '85');
    
    const mapSelect = screen.getByRole('combobox', { name: /地圖/i });
    await user.click(mapSelect);
    await user.click(screen.getByText('DT'));
    
    await user.type(screen.getByLabelText(/開始時間/i), '2025-07-15T20:00');
    await user.type(screen.getByLabelText(/結束時間/i), '2025-07-15T22:00');
    await user.type(screen.getByLabelText(/遊戲 ID/i), 'TestPlayer123');
    
    const submitButton = screen.getByRole('button', { name: /建立組隊/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });
  });
});