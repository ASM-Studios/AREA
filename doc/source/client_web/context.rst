Context Management Documentation
===============================

Overview
--------

This project uses React Context to manage global state across the application. Contexts are used to provide and consume values such as user information and theme settings. This documentation will guide you through the existing context setup and how to create your own context, including both cookie and non-cookie related contexts.

Existing Contexts
-----------------

Theme Context
~~~~~~~~~~~~~

The `ThemeContext` manages the application's theme (light or dark). It loads the theme from cookies at initialization and updates cookies when the theme changes.

**ThemeContext.tsx**

.. code-block:: typescript

    import { createContext, useState, useEffect, ReactNode } from 'react';
    import Cookies from 'js-cookie';

    type ThemeContextType = {
        theme: 'light' | 'dark';
        setTheme: (theme: 'light' | 'dark') => void;
    };

    export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

    export const ThemeProvider = ({ children }: { children: ReactNode }) => {
        const [theme, setTheme] = useState<'light' | 'dark'>('light');

        useEffect(() => {
            const savedTheme = Cookies.get('theme') as 'light' | 'dark';
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }, []);

        const updateTheme = (newTheme: 'light' | 'dark') => {
            setTheme(newTheme);
            Cookies.set('theme', newTheme, { expires: 365 });
        };

        return (
            <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
                {children}
            </ThemeContext.Provider>
        );
    };

User Context
~~~~~~~~~~~~

The `UserContext` manages user information such as user ID and name. It does not use cookies.

**UserContext.tsx**

.. code-block:: typescript

    import { createContext, useState, ReactNode } from 'react';

    interface User {
        id: string;
        name: string;
    }

    interface UserContextType {
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

Using Contexts
--------------

To use the contexts in your components, you can use the custom hooks `useTheme` and `useUser`.

**ContextHooks.ts**

.. code-block:: typescript

    const Component = () => {
        const { theme, setTheme } = useTheme();
        const { user, setUser } = useUser();

        return (
            <div>
                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    Toggle Theme
                </button>
                <p>{user ? `Hello, ${user.name}!` : 'Not logged in'}</p>
            </div>
        );
    };

Creating Your Own Context
-------------------------

Non-Cookie Related Context
~~~~~~~~~~~~~~~~~~~~~~~~~~

1. Create a new context file, e.g., `MyContext.tsx`.

.. code-block:: typescript

    import { createContext, useState, ReactNode } from 'react';

    interface MyContextType {
        value: string;
        setValue: (value: string) => void;
    }

    export const MyContext = createContext<MyContextType | undefined>(undefined);

    export const MyProvider = ({ children }: { children: ReactNode }) => {
        const [value, setValue] = useState<string>('');

        return (
            <MyContext.Provider value={{ value, setValue }}>
                {children}
            </MyContext.Provider>
        );
    };

2. Add the new provider to `CombinedProviders.tsx`.

.. code-block:: typescript

    import { ReactNode } from 'react';
    import { UserProvider } from './UserContext';
    import { ThemeProvider } from './ThemeContext';
    import { MyProvider } from './MyContext';

    const providers = [
        UserProvider,
        ThemeProvider,
        MyProvider,
        // Add more providers here
    ];

    const CombinedProviders = ({ children }: { children: ReactNode }) => {
        return providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
    };

    export default CombinedProviders;

3. Create a custom hook for the new context.

.. code-block:: typescript

    import { useContext } from 'react';
    import { MyContext } from './MyContext';

    export const useMyContext = () => {
        const context = useContext(MyContext);
        if (!context) {
            throw new Error('useMyContext must be used within a MyProvider');
        }
        return context;
    };

Cookie Related Context
~~~~~~~~~~~~~~~~~~~~~~

1. Create a new context file, e.g., `MyCookieContext.tsx`.

.. code-block:: typescript

    import { createContext, useState, useEffect, ReactNode } from 'react';
    import Cookies from 'js-cookie';

    interface MyCookieContextType {
        value: string;
        setValue: (value: string) => void;
    }

    export const MyCookieContext = createContext<MyCookieContextType | undefined>(undefined);

    export const MyCookieProvider = ({ children }: { children: ReactNode }) => {
        const [value, setValue] = useState<string>('');

        useEffect(() => {
            const savedValue = Cookies.get('myValue');
            if (savedValue) {
                setValue(savedValue);
            }
        }, []);

        const updateValue = (newValue: string) => {
            setValue(newValue);
            Cookies.set('myValue', newValue, { expires: 365 });
        };

        return (
            <MyCookieContext.Provider value={{ value, setValue: updateValue }}>
                {children}
            </MyCookieContext.Provider>
        );
    };

2. Add the new provider to `CombinedProviders.tsx`.

.. code-block:: typescript

    import { ReactNode } from 'react';
    import { UserProvider } from './UserContext';
    import { ThemeProvider } from './ThemeContext';
    import { MyCookieProvider } from './MyCookieContext';

    const providers = [
        UserProvider,
        ThemeProvider,
        MyCookieProvider,
        // Add more providers here
    ];

    const CombinedProviders = ({ children }: { children: ReactNode }) => {
        return providers.reduceRight((acc, Provider) => {
            return <Provider>{acc}</Provider>;
        }, children);
    };

    export default CombinedProviders;

3. Create a custom hook for the new context.

.. code-block:: typescript

    import { useContext } from 'react';
    import { MyCookieContext } from './MyCookieContext';

    export const useMyCookieContext = () => {
        const context = useContext(MyCookieContext);
        if (!context) {
            throw new Error('useMyCookieContext must be used within a MyCookieProvider');
        }
        return context;
    };
