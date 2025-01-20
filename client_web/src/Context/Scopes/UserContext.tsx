import React, { createContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Translation } from '@/Config/translation.types';

import en_language from '../../../locales/en';
import fr_language from '../../../locales/fr';
import es_language from '../../../locales/es';
import pirate_language from '../../../locales/pirate';
import { instanceWithAuth, user as userRoute } from "@Config/backend.routes";

export interface ServicesDescription {
    id: number;
    name: string;
    connectedAt: string;
}

export interface User {
    username: string;
    email: string;
    services: ServicesDescription[];
    isEmailValid: boolean;
    methods: string[];
}

export interface UserPayload {
    user: User;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    language: string;
    setLanguage: (lang: string) => void;
    translations: Translation;
    setTranslations: (translations: Translation) => void;
    totpLoggingIn: boolean;
    setTotpLoggingIn: (value: boolean) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const languageMap: { [key: string]: Translation } = {
    en: en_language,
    fr: fr_language,
    es: es_language,
    pirate: pirate_language,
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [language, setLanguage] = useState<string>(Cookies.get('language') ?? 'en');
    const [translations, setTranslations] = useState<Translation>(en_language);
    const [totpLoggingIn, setTotpLoggingIn] = useState<boolean>(false);

    React.useEffect(() => {
        Cookies.set('language', language, { expires: 365 });
        setTranslations(languageMap[language as keyof typeof languageMap]);
    }, [language]);

    React.useEffect(() => {
        instanceWithAuth.get(userRoute.me)
            .then((response: { data: UserPayload }) => {
                setUser(response?.data?.user);
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            language,
            setLanguage,
            translations,
            setTranslations,
            totpLoggingIn,
            setTotpLoggingIn
        }}>
            {children}
        </UserContext.Provider>
    );
};
