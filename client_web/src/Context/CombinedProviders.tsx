import { ReactNode } from 'react';
import { UserProvider } from './Scopes/UserContext';
import { ThemeProvider } from './Scopes/ThemeContext';
import { AuthProvider } from './Scopes/AuthContext';
import { ErrorProvider } from './Scopes/ErrorContext';

const providers = [
    UserProvider,
    ThemeProvider,
    AuthProvider,
    ErrorProvider
    // Add more providers here
];

const CombinedProviders = ({ children }: { children: ReactNode }) => {
    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
};

export default CombinedProviders;
