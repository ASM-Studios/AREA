import { Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscordCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');
            const storedState = localStorage.getItem('discord_auth_state');

            try {
                if (state === null || state !== storedState) {
                    throw new Error('State mismatch. Please try again.');
                }

                if (error) {
                    throw new Error('Failed to connect with Discord');
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                // TEMP: Store the code as if it were a token
                // TODO: Implement actual token exchange with your backend
                sessionStorage.setItem('access_token', code);
                sessionStorage.setItem('refresh_token', 'dummy_refresh_token');

                // Only navigate to dashboard if we reach this point successfully
                setTimeout(() => {
                    if (code && !error && state === storedState) {
                        localStorage.removeItem('discord_auth_state');
                        navigate('/dashboard');
                    }
                }, 2000);
                return;
            } catch (error: unknown) {
                setError((error as Error)?.message || 'Failed to connect with Discord');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        };

        handleCallback().catch(console.error);
    }, [navigate]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 300, textAlign: 'center' }}>
                {error ? (
                    <>
                        <h3 style={{ color: '#ff4d4f' }}>
                            {error}
                        </h3>
                        <p>
                            Redirecting you back...
                        </p>
                    </>
                ) : (
                    <>
                        <Spin size="large" />
                        <h3 style={{ marginTop: 24 }}>
                            Connecting to Discord
                        </h3>
                        <p>
                            Please wait while we complete your authentication...
                        </p>
                    </>
                )}
            </Card>
        </div>
    );
};

export default DiscordCallback; 