import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingDots from '@/Components/LoadingDots/LoadingDots';
import { useUser } from '@/Context/ContextHooks';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Download: React.FC = () => {
    const navigate = useNavigate();
    const { translations, user } = useUser();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let isDownloading = false;

        const checkAndDownloadApk = async () => {
            if (isDownloading) return;
            try {
                const response = await fetch('/client.apk', { method: 'HEAD' });
                if (response.ok) {
                    isDownloading = true;
                    navigate(user ? '/dashboard' : '/');
                }
            } catch (error) {
                console.error('Error checking APK file:', error);
                timeoutId = setTimeout(checkAndDownloadApk, 5000);
            }
        };
        checkAndDownloadApk();
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [navigate, user]);

    return (
        <main 
            role="main"
            aria-live="polite"
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 1000
            }}
        >
            <Title level={1} style={{ color: 'white', marginBottom: 24 }}>
                {translations?.download?.title}
                <LoadingDots size={8} color="#FFFFFF" />
            </Title>
            <Paragraph style={{ color: 'white', fontSize: 18, marginBottom: 32 }}>
                {translations?.download?.description1}
                <br />
                {translations?.download?.description2}
            </Paragraph>
        </main>
    );
};

export default Download; 