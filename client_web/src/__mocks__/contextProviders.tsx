import React from 'react';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};
