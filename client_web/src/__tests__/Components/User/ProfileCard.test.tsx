import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileCard from '@/Components/User/ProfileCard';
import { UserProvider } from '@/__mocks__/contextProviders';

interface MockUserData {
  user: { username: string } | undefined;
  translations: {
    userPage: {
      profileCard: {
        title: string;
        welcomeMessage: string;
        description: string;
        logoutDescription: string;
        logoutButton: string;
      };
    };
  };
}

// Create a variable to hold the mock implementation
let mockUserData: MockUserData = {
  user: {
    username: 'TestUser'
  },
  translations: {
    userPage: {
      profileCard: {
        title: 'Profile',
        welcomeMessage: 'Welcome, {name}',
        description: 'Your profile information',
        logoutDescription: 'Click to logout',
        logoutButton: 'Logout'
      }
    }
  }
};

// Mock the useUser hook
jest.mock('@/Context/ContextHooks', () => ({
  useUser: () => mockUserData
}));

jest.mock('@/Config/backend.routes', () => ({
  auth: {},
  instanceWithAuth: {}
}));

describe('ProfileCard Component', () => {
  const mockHandleLogout = jest.fn();
  const mockSetHoverCount = jest.fn();
  const mockSetNeedReload = jest.fn();
  const defaultProps = {
    handleLogout: mockHandleLogout,
    hoverCount: 0,
    setHoverCount: mockSetHoverCount,
    hoverLimit: 4,
    setNeedReload: mockSetNeedReload
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockUserData to default state
    mockUserData = {
      user: {
        username: 'TestUser'
      },
      translations: {
        userPage: {
          profileCard: {
            title: 'Profile',
            welcomeMessage: 'Welcome, {name}',
            description: 'Your profile information',
            logoutDescription: 'Click to logout',
            logoutButton: 'Logout'
          }
        }
      }
    };
  });

  const renderProfileCard = () => {
    return render(
      <BrowserRouter>
        <UserProvider>
          <ProfileCard {...defaultProps} />
        </UserProvider>
      </BrowserRouter>
    );
  };

  it('renders profile card with user information', () => {
    renderProfileCard();
    expect(screen.getByText('Your profile information')).toBeInTheDocument();
    expect(screen.getByText('Click to logout')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls handleLogout when logout button is clicked', () => {
    renderProfileCard();
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('updates hover count when mouse enters logout button within limit', () => {
    renderProfileCard();
    const logoutButton = screen.getByText('Logout');
    fireEvent.mouseEnter(logoutButton);
    expect(mockSetHoverCount).toHaveBeenCalledWith(1);
  });

  it('renders with fallback username when user is undefined', () => {
    mockUserData = {
      ...mockUserData,
      user: undefined
    };
    renderProfileCard();
    const welcomeText = screen.getByText((content) => content.includes('Welcome, User'));
    expect(welcomeText).toBeInTheDocument();
  });

  // Note: The logout button's "dodge" behavior (random position on hover) is intentionally not tested
  // as it's meant to be a playful UI element and testing random movements would be unreliable and unnecessary.
  console.info('⚠️ Skipping tests for logout button movement behavior as it\'s a playful UI element not meant for testing');

  it('renders avatar component', () => {
    renderProfileCard();
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    const { container } = renderProfileCard();
    const card = container.querySelector('.ant-card');
    expect(card).toBeInTheDocument();
  });
});
