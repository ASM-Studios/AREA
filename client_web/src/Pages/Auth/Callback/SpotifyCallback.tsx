import { Card, Spin } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance, instanceWithAuth, oauth } from "@Config/backend.routes";
import { uri } from "@Config/uri";
import { useAuth } from "@/Context/ContextHooks";

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setJsonWebToken } = useAuth();
    const hasHandledCallback = useRef(false);

    const isBinding = localStorage.getItem("jsonWebToken");

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');
            const storedState = localStorage.getItem('spotify_auth_state');
            const codeVerifier = localStorage.getItem('code_verifier');

            try {
                if (state === null || state !== storedState) {
                    throw new Error('State mismatch. Please try again.');
                }

                let response;

                if (isBinding) {
                    response = await instanceWithAuth.post(oauth.spotify.bind, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.spotify.auth.redirectUri,
                    });
                } else {
                    response = await instance.post(oauth.spotify.auth, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.spotify.auth.redirectUri,
                    })
                }

                if (!response.status || response.status !== 200) {
                    throw new Error('Failed to exchange token');
                }

                if (!isBinding) {
                    setJsonWebToken(response?.data?.jwt);
                }

                localStorage.removeItem('spotify_auth_state');
                localStorage.removeItem('code_verifier');

                setTimeout(() => {
                    if (code && !error && state === storedState) {
                        sessionStorage.removeItem('spotify_auth_state');
                        navigate('/dashboard');
                    }
                }, 2000);
                return;
            } catch (error: unknown) {
                setError((error as Error)?.message || 'Failed to connect with Spotify');
                setTimeout(() => {
                    navigate(isBinding ? '/account/me' : '/login');
                }, 2000);
            }
        };

        if (!hasHandledCallback.current) {
            handleCallback().catch(console.error);
            hasHandledCallback.current = true;
        }
    }, [navigate, setJsonWebToken]);

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
                            Connecting to Spotify
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

export default SpotifyCallback;
