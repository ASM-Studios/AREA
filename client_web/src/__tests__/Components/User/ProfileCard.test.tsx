import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileCard from '@/Components/User/ProfileCard';
import { UserProvider } from '../../../__mocks__/contextProviders';

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

describe('ProfileCard Component', () => {
  const mockHandleLogout = jest.fn();
  const mockSetHoverCount = jest.fn();
  const defaultProps = {
    handleLogout: mockHandleLogout,
    hoverCount: 0,
    setHoverCount: mockSetHoverCount,
    hoverLimit: 3
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

  it('renders profile card with user information', () => {
    render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();
    expect(screen.getByText('Your profile information')).toBeInTheDocument();
    expect(screen.getByText('Click to logout')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls handleLogout when logout button is clicked', () => {
    render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  it('updates hover count when mouse enters logout button within limit', () => {
    render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.mouseEnter(logoutButton);

    expect(mockSetHoverCount).toHaveBeenCalledWith(1);
  });

  it('does not update hover count when limit is reached', () => {
    render(
      <UserProvider>
        <ProfileCard {...defaultProps} hoverCount={3} hoverLimit={3} />
      </UserProvider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.mouseEnter(logoutButton);

    expect(mockSetHoverCount).not.toHaveBeenCalled();
  });

  it('renders with fallback username when user is undefined', () => {
    // Override the mock data for this specific test
    mockUserData = {
      ...mockUserData,
      user: undefined
    };

    render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    const welcomeText = screen.getByText((content) => content.includes('Welcome, User'));
    expect(welcomeText).toBeInTheDocument();
  });

  // Note: The logout button's "dodge" behavior (random position on hover) is intentionally not tested
  // as it's meant to be a playful UI element and testing random movements would be unreliable and unnecessary.
  console.info('⚠️ Skipping tests for logout button movement behavior as it\'s a playful UI element not meant for testing');

  it('renders avatar component', () => {
    render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    // Check if avatar is rendered
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    const { container } = render(
      <UserProvider>
        <ProfileCard {...defaultProps} />
      </UserProvider>
    );

    // Check for Card component
    expect(container.querySelector('.ant-card')).toBeInTheDocument();
    // Check for Space components
    expect(container.querySelectorAll('.ant-space')).toHaveLength(2);
  });
});