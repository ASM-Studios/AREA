import { Layout, Menu, Button, Dropdown, Tooltip, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useTheme, useUser } from '@/Context/ContextHooks';
import React, { useEffect, useState } from "react";
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const { isAuthenticated, setIsAuthenticated, setJsonWebToken } = useAuth();
    const { theme } = useTheme();
    const { translations, setLanguage, language } = useUser();

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
        { key: '/', label: <Link to="/">{translations?.header?.home}</Link>, visibility: Visibility.ALWAYS },
        { key: '/login', label: <Link to="/login">{translations?.header?.login}</Link>, visibility: Visibility.GUEST },
        { key: '/register', label: <Link to="/register">{translations?.header?.register}</Link>, visibility: Visibility.GUEST },
        { key: '/dashboard', label: <Link to="/dashboard">{translations?.header?.dashboard}</Link>, visibility: Visibility.AUTH },
        { key: '/workflow/create', label: <Link to="/workflow/create">{translations?.header?.createWorkflow}</Link>, visibility: Visibility.AUTH },
        { key: '/accessibility', label: <Link to="/accessibility">{translations?.header?.accessibility}</Link>, visibility: Visibility.ALWAYS },
        { key: '/download', label: <Link to="/download">{translations?.header?.download}</Link>, visibility: Visibility.ALWAYS },
    ];

    const languageOptions = [
        { key: 'en', label: '🇬🇧 English', value: 'en' },
        { key: 'fr', label: '🇫🇷 Français', value: 'fr' },
        { key: 'es', label: '🇪🇸 Español', value: 'es' },
        { key: 'pirate', label: '🏴‍☠️ Pirate', value: 'pirate' }
    ];

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
    };

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
            label: translations?.header?.profile?.settings
        },
        {
            key: 'logout',
            label: translations?.header?.profile?.logout,
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
                {isMobile ? (
                    <Dropdown
                        menu={{
                            items: filteredMenuItems,
                            selectedKeys: [selectedKey],
                            onClick: ({ key }) => setSelectedKey(key)
                        }}
                        trigger={['click']}
                        aria-label="Mobile navigation menu"
                    >
                        <Button icon={<MenuOutlined />} aria-label="Open menu" />
                    </Dropdown>
                ) : (
                    <Menu
                        theme={theme}
                        mode="horizontal"
                        style={{ flex: 1 }}
                        items={filteredMenuItems}
                        selectedKeys={[selectedKey]}
                        aria-label="Main navigation menu"
                    />
                )}
                <Space style={{ marginLeft: 'auto' }}>
                    <Dropdown
                        menu={{
                            items: languageOptions.map(lang => ({
                                key: lang.key,
                                label: lang.label,
                                onClick: () => handleLanguageChange(lang.value)
                            })),
                        }}
                        placement="bottomRight"
                        arrow
                        aria-label="Language selection menu"
                    >
                        <Button type="text" aria-label="Select language">
                            {languageOptions.find(lang => lang.value === language)?.label || '🌐 Language'}
                        </Button>
                    </Dropdown>
                    <Tooltip title={!isAuthenticated ? translations?.header?.profile?.tooltip : ""}>
                        <div>
                            <Dropdown
                                menu={{
                                    items: profileMenuItems,
                                    onClick: handleMenuClick
                                }}
                                placement="bottomRight"
                                arrow
                                disabled={!isAuthenticated}
                                aria-label="Profile menu"
                            >
                                <Button
                                    type="text"
                                    style={{
                                        height: '40px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    aria-label="Profile options"
                                >
                                    <UserOutlined />
                                    <p>{translations?.header?.profile?.title}</p>
                                </Button>
                            </Dropdown>
                        </div>
                    </Tooltip>
                </Space>
            </AntHeader>
        </div>
    );
};

export default Header;
