import { createContext, useState, ReactNode } from 'react';

interface Error {
    error: string;
    errorDescription: string;
}

export interface ErrorContextType {
    error: Error | null;
    setError: (error: Error | null) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<Error | null>(null);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
}
