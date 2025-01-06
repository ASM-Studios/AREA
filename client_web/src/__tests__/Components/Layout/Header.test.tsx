import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '@/Components/Layout/Header';
import { AuthProvider, ThemeProvider, UserProvider } from '@/__mocks__/contextProviders';
import { useMediaQuery } from 'react-responsive';

// Mock the react-responsive hook
jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn().mockReturnValue(false)
}));

// Mock the context hooks
jest.mock('@/Context/ContextHooks', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    setIsAuthenticated: jest.fn(),
    setJsonWebToken: jest.fn()
  }),
  useTheme: () => ({
    theme: 'light'
  }),
  useUser: () => ({
    translations: {
      header: {
        home: 'header.home',
        login: 'header.login',
        register: 'header.register',
        dashboard: 'header.dashboard',
        profile: {
          title: 'header.profile.title',
          tooltip: 'header.profile.tooltip',
          settings: 'header.profile.settings',
          logout: 'header.profile.logout'
        }
      }
    },
    language: 'en',
    setLanguage: jest.fn()
  })
}));

const renderHeader = async () => {
  let rendered;
  await act(async () => {
    rendered = render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <Header />
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  });
  return rendered;
};

describe('Header Component', () => {
  it('renders navigation links when not authenticated', async () => {
    await renderHeader();
    expect(screen.getByText('header.home')).toBeInTheDocument();
    expect(screen.getByText('header.login')).toBeInTheDocument();
    expect(screen.getByText('header.register')).toBeInTheDocument();
    expect(screen.queryByText('header.dashboard')).not.toBeInTheDocument();
  });

  it('shows language dropdown', async () => {
    await renderHeader();
    const languageButton = screen.getByText('🇬🇧 English');
    expect(languageButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(languageButton);
    });
  });

  it('shows profile button when not authenticated', async () => {
    await renderHeader();
    const profileButton = screen.getByText('header.profile.title');
    expect(profileButton).toBeInTheDocument();
    
    // Find the button container
    const buttonContainer = screen.getByRole('button', { 
      name: /header\.profile\.title/i 
    });
    expect(buttonContainer).toBeInTheDocument();

    // Hover over the button to trigger tooltip
    await act(async () => {
      fireEvent.mouseEnter(buttonContainer);
    });

    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // Test mobile view
  it('renders hamburger menu on mobile', async () => {
    // Mock mobile view
    jest.mocked(useMediaQuery).mockReturnValue(true);
    await renderHeader();
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
}); 
