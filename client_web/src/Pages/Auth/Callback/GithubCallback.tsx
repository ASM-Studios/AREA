import { Card, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance, instanceWithAuth, oauth } from "@Config/backend.routes";
import { uri } from "@Config/uri";
import { useAuth } from "@/Context/ContextHooks";

const GithubCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setJsonWebToken, jsonWebToken } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');
            const storedState = localStorage.getItem('github_auth_state');

            try {
                if (state === null || state !== storedState) {
                    throw new Error('State mismatch. Please try again.');
                }

                let response;

                if (jsonWebToken) {
                    response = await instanceWithAuth.post(oauth.github.bind, {
                        code,
                        redirect_uri: uri.github.auth.redirectUri,
                    });
                } else {
                    response = await instance.post(oauth.github.auth, {
                        code,
                        redirect_uri: uri.github.auth.redirectUri,
                    });
                }

                // @ts-expect-error
                if (!response.ok) {
                    throw new Error('Failed to exchange token');
                }

                // @ts-expect-error
                const data = await response.json();

                setJsonWebToken(data.token);

                localStorage.removeItem('github_auth_state');

                setTimeout(() => {
                    if (code && !error && state === storedState) {
                        sessionStorage.removeItem('github_auth_state');
                        navigate('/dashboard');
                    }
                }, 2000);
                return;
            } catch (error: unknown) {
                setError((error as Error)?.message || 'Failed to connect with GitHub');
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
                            Connecting to GitHub
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

export default GithubCallback;