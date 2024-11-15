import { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';

const providers = [
    UserProvider,
    ThemeProvider,
    // Add more providers here
];

const CombinedProviders = ({ children }: { children: ReactNode }) => {
    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
};

export default CombinedProviders;
