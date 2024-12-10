import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useTheme } from '@/Context/ContextHooks';
import React, { useEffect, useState } from "react";
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

enum Visibility {
    ALWAYS = 'always',
    AUTH = 'auth',
    GUEST = 'guest',
}

interface MenuItems {
    key: string;
    label: React.ReactNode;
    visibility?: Visibility;
}

const menuItems: MenuItems[] = [
    { key: '/', label: <Link to="/">Home</Link>, visibility: Visibility.ALWAYS },
    { key: '/login', label: <Link to="/login">Login</Link>, visibility: Visibility.GUEST },
    { key: '/register', label: <Link to="/register">Register</Link>, visibility: Visibility.GUEST },
    { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link>, visibility: Visibility.AUTH },
    { key: '/workflow/create', label: <Link to="/workflow/create">Create Workflow</Link>, visibility: Visibility.AUTH },
];

const Header: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);

    const { isAuthenticated, setIsAuthenticated, setJsonWebToken } = useAuth();

    useEffect(() => {
        setSelectedKey(location.pathname);
    }, [location.pathname]);

    function handleLogout() {
        setIsAuthenticated(false);
        setJsonWebToken('');
        window.location.href = '/';
    }

    const profileMenuItems = [
        {
            key: 'profile',
            label: 'Profile Settings'
        },
        {
            key: 'logout',
            label: 'Logout',
            danger: true
        }
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            handleLogout();
        }
        if (key === 'profile') {
            navigate('/account/me');
        }
    };

    const filteredMenuItems = menuItems.filter(item => {
        if (item.visibility === Visibility.ALWAYS) return true;
        if (item.visibility === Visibility.AUTH && isAuthenticated) return true;
        return item.visibility === Visibility.GUEST && !isAuthenticated;
    });

    return (
        <div style={{ padding: 24, position: 'relative', zIndex: 1 }}>
            <AntHeader style={{ backgroundColor: theme === "dark" ? '#001529' : 'white', display: 'flex', alignItems: 'center', zIndex: 1, borderRadius: '8px' }}>
                <Menu
                    theme={theme}
                    mode="horizontal"
                    style={{ flex: 1 }}
                    items={filteredMenuItems}
                    selectedKeys={[selectedKey]}
                />
                <Dropdown
                    menu={{ 
                        items: profileMenuItems,
                        onClick: handleMenuClick
                    }}
                    placement="bottomRight"
                    arrow
                >
                    <Button 
                        type="text"
                        style={{
                            marginLeft: 'auto',
                            height: '40px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Avatar 
                            icon={<UserOutlined />}
                            style={{ 
                                backgroundColor: theme === "dark" ? '#1890ff' : '#001529'
                            }}
                        />
                        <span>Profile</span>
                    </Button>
                </Dropdown>
            </AntHeader>
        </div>
    );
};

export default Header;
