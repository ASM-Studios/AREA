import { Card, Spin } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance, instanceWithAuth, oauth } from "@Config/backend.routes";
import { uri } from "@Config/uri";
import { useAuth } from "@/Context/ContextHooks";

const TwitchCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setJsonWebToken, jsonWebToken } = useAuth();
    const hasHandledCallback = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');
            const storedState = localStorage.getItem('twitch_auth_state');
            const codeVerifier = localStorage.getItem('code_verifier');

            try {
                if (state === null || state !== storedState) {
                    throw new Error('State mismatch. Please try again.');
                }

                let response;

                if (jsonWebToken) {
                    response = await instanceWithAuth.post(oauth.twitch.bind, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.twitch.auth.redirectUri,
                    });
                } else {
                    response = await instance.post(oauth.twitch.auth, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.twitch.auth.redirectUri,
                    });
                }

                // @ts-expect-error
                if (!response.ok) {
                    throw new Error('Failed to exchange token');
                }

                // @ts-expect-error
                const data = await response.json();

                setJsonWebToken(data.token);

                localStorage.removeItem('twitch_auth_state');
                localStorage.removeItem('code_verifier');

                setTimeout(() => {
                    if (code && !error && state === storedState) {
                        sessionStorage.removeItem('twitch_auth_state');
                        navigate('/dashboard');
                    }
                }, 2000);
                return;
            } catch (error: unknown) {
                setError((error as Error)?.message || 'Failed to connect with Twitch');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        };

        if (!hasHandledCallback.current) {
            handleCallback().catch(console.error);
            hasHandledCallback.current = true;
        }
    }, [navigate, jsonWebToken, setJsonWebToken]);

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
                            Connecting to Twitch
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

export default TwitchCallback;
