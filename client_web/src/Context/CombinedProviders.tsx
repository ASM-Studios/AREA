import { ReactNode } from 'react';
import { UserProvider } from './Scopes/UserContext.tsx';
import { ThemeProvider } from './Scopes/ThemeContext.tsx';
import { AuthProvider } from './Scopes/AuthContext.tsx';

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
