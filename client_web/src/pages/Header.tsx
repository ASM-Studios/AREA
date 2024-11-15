import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTheme } from '../Context/ContextHooks';
import React from "react";

const { Header: AntHeader } = Layout;

interface MenuItems {
    [key: string]: string;
}

const menuItems: MenuItems = {
    Home: '/',
    About: '/about',
};

const Header: React.FC = () => {
    const { theme } = useTheme();

    return (
        <AntHeader style={{ backgroundColor: theme === "dark" ? '#001529' : 'white', display: 'flex' }}>
            <Menu theme={theme} mode="horizontal" style={{ flex: 1 }}>
                {Object.entries(menuItems).map(([text, link]) => (
                    <Menu.Item key={link}>
                        <Link to={link}>{text}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </AntHeader>
    );
};

export default Header;
