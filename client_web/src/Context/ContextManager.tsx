import { ReactNode } from 'react';
import CombinedProviders from './CombinedProviders';

const ContextManager = ({ children }: { children: ReactNode }) => {
    return <CombinedProviders>{children}</CombinedProviders>;
};

export { ContextManager };
