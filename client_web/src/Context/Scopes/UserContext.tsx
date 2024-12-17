import { createContext, useState, ReactNode } from 'react';

export interface ServicesDescription {
    id: number;
    name: string;
    connectedAt: string;
}

export interface User {
    username: string;
    email: string;
    services: ServicesDescription[];
}

export interface UserPayload {
    user: User;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
