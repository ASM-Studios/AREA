import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Context/ContextHooks';
import React from "react";

const { Header: AntHeader } = Layout;

interface MenuItems {
    key: string;
    label: React.ReactNode;
}

const menuItems: MenuItems[] = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/about', label: <Link to="/about">About</Link> },
];

const Header: React.FC = () => {
    const { theme } = useTheme();

    return (
        <AntHeader style={{ backgroundColor: theme === "dark" ? '#001529' : 'white', display: 'flex' }}>
            <Menu theme={theme} mode="horizontal" style={{ flex: 1 }} items={menuItems} />
        </AntHeader>
    );
};

export default Header;
