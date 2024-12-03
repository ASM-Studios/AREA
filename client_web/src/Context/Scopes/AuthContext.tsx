import {createContext, useState, ReactNode, useContext, useEffect} from 'react';

export interface AuthContextType {
    isAuthenticated: boolean;
    jsonWebToken: string;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setJsonWebToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [jsonWebToken, setJsonWebToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jsonWebToken');
        if (token) {
            setJsonWebToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                jsonWebToken,
                setJsonWebToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
