import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/Components/Layout/Footer';
import { ThemeProvider, UserProvider } from '../../../__mocks__/contextProviders';

// Mock the context hooks
jest.mock('@/Context/ContextHooks', () => ({
  useTheme: () => ({
    theme: 'light'
  }),
  useUser: () => ({
    translations: {
      footer: {
        reservedRights: 'footer.reservedRights'
      }
    }
  })
}));

const renderFooter = () => {
  return render(
    <ThemeProvider>
      <UserProvider>
        <Footer />
      </UserProvider>
    </ThemeProvider>
  );
};

describe('Footer Component', () => {
  it('renders footer text', () => {
    renderFooter();
    expect(screen.getByText('footer.reservedRights')).toBeInTheDocument();
  });

  it('applies correct styles based on theme', () => {
    renderFooter();
    const footerContainer = screen.getByText('footer.reservedRights')
      .closest('div[style*="padding"]'); // Get the outer container
    const footer = screen.getByText('footer.reservedRights')
      .closest('footer'); // Get the actual footer element

    expect(footerContainer).toHaveStyle({
      padding: '24px',
      position: 'relative',
      zIndex: 1
    });

    expect(footer).toHaveStyle({
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center',
      borderRadius: '8px'
    });
  });
}); 