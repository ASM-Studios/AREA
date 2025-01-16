import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Card, Typography, Progress } from 'antd';
import LoadingDots from '@/Components/LoadingDots/LoadingDots';
import { useUser } from '@/Context/ContextHooks';
import LinkButton from "@/Components/LinkButton";

const { Title } = Typography;

const Download: React.FC = () => {
    const navigate = useNavigate();
    const { translations, user } = useUser();
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = React.useRef<NodeJS.Timeout>();
    const progressRef = React.useRef<NodeJS.Timeout>();
    const [stoppingPoint] = useState(Math.round(78 + Math.random() * 4));

    const checkAndDownloadApk = () => {
        if (isDownloading) {
            return;
        }

        fetch('/client.apk', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    setIsDownloading(true);
                    setProgress(100);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    if (progressRef.current) {
                        clearInterval(progressRef.current);
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
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Error checking APK file:', error);
            });
    };

    useEffect(() => {
        intervalRef.current = setInterval(checkAndDownloadApk, 5000);
        
        progressRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev < stoppingPoint) {
                    const baseIncrement = (stoppingPoint - prev) / 20;
                    const randomFactor = 0.5 + Math.random() * 1.5;
                    const increment = Math.max(0.2, baseIncrement * randomFactor);
                    return Math.round(Math.min(stoppingPoint, prev + increment));
                }
                return prev;
            });
        }, 100);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (progressRef.current) clearInterval(progressRef.current);
        };
    }, [stoppingPoint]);

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
                        <>
                            <Progress type={"circle"} percent={progress} status={isDownloading ? 'success' : 'active'} />
                            <div style={{ marginTop: '16px' }}>
                                <LinkButton text={translations?.errors?.api?.backHome} goBack/>
                            </div>
                        </>
                    }
                    style={{zIndex: 1, position: 'relative'}}
                />
            </Card>
        </main>
    )
};

export default Download;
