import React from "react";
import { Layout } from 'antd';
import { useTheme, useUser } from '@/Context/ContextHooks';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    const { theme } = useTheme();
    const { translations } = useUser();

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
                {translations?.footer?.reservedRights}
            </Footer>
        </div>
    );
};

export default AppFooter;
