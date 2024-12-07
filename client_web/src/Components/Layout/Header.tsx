import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/Context/ContextHooks';
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

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    return (
        <div style={{ padding: 24, position: 'relative', zIndex: 1 }}>
            <AntHeader style={{ backgroundColor: theme === "dark" ? '#001529' : 'white', display: 'flex', zIndex: 1, borderRadius: '8px' }}>
                <Menu
                    theme={theme}
                    mode="horizontal"
                    style={{ flex: 1 }}
                    items={menuItems}
                    selectedKeys={[selectedKey]}
                />
            </AntHeader>
        </div>
    );
};

export default Header;
