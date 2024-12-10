import { Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance, instanceWithAuth, oauth } from "@Config/backend.routes";
import { uri } from "@Config/uri";
import { useAuth } from "@/Context/ContextHooks";

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setJsonWebToken, jsonWebToken } = useAuth();

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
                    console.log("State: ", state);
                    console.log("Stored State: ", storedState);
                    throw new Error('State mismatch. Please try again.');
                }

                if (error) {
                    throw new Error('Failed to connect with Spotify');
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                let response;

                if (jsonWebToken) {
                    response = await instanceWithAuth.post(oauth.spotify, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.spotify.auth.redirectUri,
                    });
                } else {
                    response = await instance.post(oauth.spotify, {
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: uri.spotify.auth.redirectUri,
                    })
                }

                // @ts-expect-error
                if (!response.ok) {
                    throw new Error('Failed to exchange token');
                }

                // @ts-expect-error
                const data = await response.json();

                setJsonWebToken(data.token);

                localStorage.removeItem('spotify_auth_state');
                localStorage.removeItem('code_verifier');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);

            } catch (error: unknown) {
                // @ts-expect-error
                setError(error?.message as string || 'Failed to connect with Spotify');
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
