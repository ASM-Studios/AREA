import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Card, Typography } from 'antd';
import LoadingDots from '@/Components/LoadingDots/LoadingDots';
import { useUser } from '@/Context/ContextHooks';
import LinkButton from "@/Components/LinkButton";

const { Title } = Typography;

const Download: React.FC = () => {
    const navigate = useNavigate();
    const { translations, user } = useUser();
    const [isDownloading, setIsDownloading] = useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout>();

    const checkAndDownloadApk = () => {
        if (isDownloading) {
            return;
        }

        fetch('/client.apk', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    setIsDownloading(true);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }

                    const link = document.createElement('a');
                    link.href = '/client.apk';
                    link.download = 'client.apk';
                    link.setAttribute('aria-label', 'Download Android application');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setTimeout(() => {
                        navigate(user ? '/dashboard' : '/');
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error checking APK file:', error);
            });
    };

    useEffect(() => {
        intervalRef.current = setInterval(checkAndDownloadApk, 5000);
        checkAndDownloadApk();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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
            <Card size="small">
                <Result
                    status={isDownloading ? 'success' : 'warning'}
                    title={
                        <span>
                            <Title style={{ display: 'inline' }}>{translations?.download?.title}</Title> <LoadingDots/>
                        </span>
                    }
                    subTitle={translations?.download?.description}
                    extra={
                        <LinkButton text={translations?.errors?.api?.backHome} goBack/>
                    }
                    style={{zIndex: 1, position: 'relative'}}
                />
            </Card>
        </main>
    )
};

export default Download;
