import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useTheme } from '@/Context/ContextHooks';
import React, { useEffect, useState } from "react";

const { Header: AntHeader } = Layout;

interface MenuItems {
    key: string;
    label: React.ReactNode;
}

const menuItems: MenuItems[] = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link> },
];

const Header: React.FC = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

    const { setIsAuthenticated, setJsonWebToken } = useAuth();

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    function handleLogout() {
        localStorage.removeItem('jsonWebToken');
        setIsAuthenticated(false);
        setJsonWebToken('');
        window.location.href = '/';
    }

    return (
        <div style={{ padding: 24, position: 'relative', zIndex: 1 }}>
            <AntHeader style={{ backgroundColor: theme === "dark" ? '#001529' : 'white', display: 'flex', alignItems: 'center', zIndex: 1, borderRadius: '8px' }}>
                <Menu
                    theme={theme}
                    mode="horizontal"
                    style={{ flex: 1 }}
                    items={menuItems}
                    selectedKeys={[selectedKey]}
                />
                <Button //TODO: Replace by account management
                    type="primary" 
                    danger
                    onClick={handleLogout} 
                    style={{ 
                        marginLeft: 'auto',
                        height: '32px',
                        borderRadius: '6px',
                        fontWeight: 500,
                    }}
                >
                    Logout
                </Button>
            </AntHeader>
        </div>
    );
};

export default Header;
