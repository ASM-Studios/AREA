import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin } from "antd";

const LinkedinCallback = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const hasHandledCallback = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            const storedState = sessionStorage.getItem('linkedinState');

            sessionStorage.removeItem('linkedinState');

            if (error) {
                console.error('LinkedIn OAuth error:', error);
                setError('Failed to authenticate with LinkedIn');
                navigate('/login');
                return;
            }

            if (!code || !state || state !== storedState) {
                console.error('Invalid OAuth callback');
                setError('Invalid LinkedIn OAuth callback');
                navigate('/login');
                return;
            }

            try {
                // TODO: Connect to the backend to exchange the code for an access token

                // Handle successful authentication (e.g., store token, update user state)
                console.log('LinkedIn authentication successful');

                // Redirect to dashboard instead of home
                navigate('/dashboard');
            } catch (error) {
                console.error('LinkedIn authentication error:', error);
                setError(`LinkedIn authentication error: ${error}`);
                navigate('/login');
            }
        };

        if (!hasHandledCallback.current) {
            handleCallback().then(() => {});
            hasHandledCallback.current = true;
        }
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
                            Connecting to LinkedIn
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

export default LinkedinCallback;
