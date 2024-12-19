import { useLocation } from 'react-router-dom';
import Header from './Header';
import AppFooter from './Footer';
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const headerIncludedPaths: (string | RegExp)[] = ['/', '/dashboard', '/account/me', '/workflow/create', /^\/workflow\/update\/\d+$/];
    const footerIncludedPaths: (string | RegExp)[] = ['/', '/dashboard', '/account/me', '/workflow/create', /^\/workflow\/update\/\d+$/];

    const isHeaderIncluded = headerIncludedPaths.some(path =>
        typeof path === 'string' ? path === location.pathname : path.test(location.pathname)
    );

    const isFooterIncluded = footerIncludedPaths.some(path =>
        typeof path === 'string' ? path === location.pathname : path.test(location.pathname)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '98vh', overflowX: 'hidden' }}>
            {isHeaderIncluded && <Header />}
            <div style={{ flexGrow: 1 }}>
                {children}
            </div>
            {isFooterIncluded && <AppFooter />}
        </div>
    );
};

export default Layout;
