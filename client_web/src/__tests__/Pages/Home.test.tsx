import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '@/Pages/Home';
import { AuthProvider, UserProvider } from '../../__mocks__/contextProviders';
import { instance } from "@Config/backend.routes";
import { toast } from "react-toastify";

jest.mock('@Config/backend.routes', () => ({
  instance: {
    get: jest.fn()
  },
  root: {
    ping: '/ping'
  }
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn()
  }
}));

const mockUseAuth = jest.fn();
jest.mock('@/Context/ContextHooks', () => ({
  useAuth: () => mockUseAuth(),
  useUser: () => ({
    translations: {
      home: {
        title: 'home.title',
        description: 'home.description',
        getStarted: 'home.getStarted',
        upperCards: {
          firstCard: { title: 'first.title', description: 'first.description' },
          secondCard: { title: 'second.title', description: 'second.description' },
          thirdCard: { title: 'third.title', description: 'third.description' }
        },
        lowerCards: {
          firstCard: { title: 'lower1.title', description: 'lower1.description' },
          secondCard: { title: 'lower2.title', description: 'lower2.description' },
          thirdCard: { title: 'lower3.title', description: 'lower3.description' }
        }
      }
    }
  })
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Home backgroundColor="#000000" />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
  });

  it('renders main content and performs initial ping', async () => {
    (instance.get as jest.Mock).mockResolvedValue({ data: {} });
    
    await act(async () => {
      renderHome();
    });
    
    expect(screen.getByText('home.title')).toBeInTheDocument();
    expect(screen.getByText('home.description')).toBeInTheDocument();
    expect(screen.getByText('home.getStarted')).toBeInTheDocument();
    expect(instance.get).toHaveBeenCalledWith('/ping');
  });

  it('renders all cards with correct content', async () => {
    (instance.get as jest.Mock).mockResolvedValue({ data: {} });
    
    await act(async () => {
      renderHome();
    });
    
    expect(screen.getByText('first.title')).toBeInTheDocument();
    expect(screen.getByText('second.title')).toBeInTheDocument();
    expect(screen.getByText('third.title')).toBeInTheDocument();
    expect(screen.getByText('lower1.title')).toBeInTheDocument();
    expect(screen.getByText('lower2.title')).toBeInTheDocument();
    expect(screen.getByText('lower3.title')).toBeInTheDocument();
  });

  it('handles failed ping correctly', async () => {
    (instance.get as jest.Mock).mockRejectedValue(new Error('Ping failed'));
    
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to ping the server');
    });
  });

  it('navigates to login when not authenticated', async () => {
    (instance.get as jest.Mock).mockResolvedValue({ data: {} });
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    
    await act(async () => {
      renderHome();
    });

    const getStartedButton = screen.getByText('home.getStarted');
    await act(async () => {
      fireEvent.click(getStartedButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard when authenticated', async () => {
    (instance.get as jest.Mock).mockResolvedValue({ data: {} });
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    
    await act(async () => {
      renderHome();
    });

    const getStartedButton = screen.getByText('home.getStarted');
    await act(async () => {
      fireEvent.click(getStartedButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('disables get started button when ping fails', async () => {
    (instance.get as jest.Mock).mockRejectedValue(new Error('Ping failed'));
    
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'home.getStarted' });
      expect(button).toBeDisabled();
    });
  });

  it('enables get started button when ping succeeds', async () => {
    (instance.get as jest.Mock).mockResolvedValue({ data: {} });
    
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'home.getStarted' });
      expect(button).not.toBeDisabled();
    });
  });
}); 