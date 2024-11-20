import { useLocation } from 'react-router-dom';
import Header from './pages/Header';
import AppFooter from './pages/Footer';
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const headerExcludedPaths: (string | RegExp)[] = [/.*/, '/', '/login', '/register', /^\/auth\/.*\/callback$/];
    const footerExcludedPaths: (string | RegExp)[] = [/.*/, '/login', '/register', /^\/auth\/.*\/callback$/];

    const isHeaderExcluded = headerExcludedPaths.some(path =>
        typeof path === 'string' ? path === location.pathname : path.test(location.pathname)
    );

    const isFooterExcluded = footerExcludedPaths.some(path =>
        typeof path === 'string' ? path === location.pathname : path.test(location.pathname)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '98vh', overflowX: 'hidden' }}>
            {!isHeaderExcluded && <Header />}
            <div style={{ flexGrow: 1 }}>
                {children}
            </div>
            {!isFooterExcluded && <AppFooter />}
        </div>
    );
};

export default Layout;
