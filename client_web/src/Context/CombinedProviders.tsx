import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

const providers = [
    UserProvider,
    ThemeProvider,
    AuthProvider,
    // Add more providers here
];

const CombinedProviders = ({ children }: { children: ReactNode }) => {
    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
};

export default CombinedProviders;
