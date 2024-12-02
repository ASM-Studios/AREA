import { Layout } from 'antd';
import { useTheme } from '../../Context/ContextHooks.ts';
import React from "react";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    const { theme } = useTheme();

    return (
        <Footer
            style={{
                textAlign: 'center',
                position: 'sticky',
                bottom: 0,
                width: '100%',
                backgroundColor: theme === 'dark' ? '#001529' : 'white',
                color: theme === 'dark' ? 'white' : 'black',
            }}
        >
        ©2024 ASM. All Rights Reserved.
        </Footer>
    );
};

export default AppFooter;
