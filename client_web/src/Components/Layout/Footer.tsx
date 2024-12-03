import { Layout } from 'antd';
import { useTheme } from '@/Context/ContextHooks';
import React from "react";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div style={{padding: 24, position: 'relative', zIndex: 1}}>
            <Footer
                style={{
                    textAlign: 'center',
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: theme === 'dark' ? '#001529' : 'white',
                    color: theme === 'dark' ? 'white' : 'black',
                    borderRadius: '8px'
                }}
            >
            ©2024 ASM. All Rights Reserved.
            </Footer>
        </div>
    );
};

export default AppFooter;
