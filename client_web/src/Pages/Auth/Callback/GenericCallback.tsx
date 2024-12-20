import { Card, Spin } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance, instanceWithAuth, oauth } from "@Config/backend.routes";
import { uri } from "@Config/uri";
import { useAuth, useUser } from "@/Context/ContextHooks";

const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

interface ServiceCallbackMap {
    [key: string]: { auth: string, bind: string };
}

const serviceCallbackMap: ServiceCallbackMap = {
    'spotify': { auth: oauth.spotify.auth, bind: oauth.spotify.bind },
    'microsoft': { auth: oauth.microsoft.auth, bind: oauth.microsoft.bind },
    'github': { auth: oauth.github.auth, bind: oauth.github.bind },
    'google': { auth: oauth.google.auth, bind: oauth.google.bind },
    'twitch': { auth: oauth.twitch.auth, bind: oauth.twitch.bind },
    'discord': { auth: oauth.discord.auth, bind: oauth.discord.bind },
    'linkedin': { auth: oauth.linkedin.auth, bind: oauth.linkedin.bind },
};

const UriMap: Map<string, string> = new Map([
    ['spotify', uri.spotify.auth.redirectUri],
    ['microsoft', uri.microsoft.auth.redirectUri],
    ['github', uri.github.auth.redirectUri],
    ['google', uri.google.auth.redirectUri],
    ['twitch', uri.twitch.auth.redirectUri],
    ['discord', uri.discord.auth.redirectUri],
    ['linkedin', uri.linkedin.auth.redirectUri],
]);

const GenericCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [service, setService] = useState<string>('');
    const hasHandledCallback = useRef(false);
    const { setJsonWebToken } = useAuth();
    const { translations } = useUser();

    const isBinding = localStorage.getItem("jsonWebToken");

    const getRouteProvider: (service: string) => { auth: string, bind: string}  = (service: string) => {7
        return serviceCallbackMap[service];
    };

    const getUri: (service: string) => string = (service: string) => {
        return UriMap.get(service) || '';
    };

    const getServiceFromLocation = (): string | null => {
        const currentLocation = new URL(window.location.href).pathname;
        for (const [service, redirectUri] of UriMap.entries()) {
            const redirectPath = new URL(redirectUri).pathname;
            if (redirectPath === currentLocation) {
                return service;
            }
        }
        return null;
    };

    useEffect(() => {
        const service = getServiceFromLocation();
        if (service) {
            setService(service);
        } else {
            setError(`${translations?.callback.errors.invalidService}: ${service}`);
            setTimeout(() => {
                navigate(isBinding ? '/account/me' : '/login');
            }, 2000);
        }
    }, []);

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            const state = urlParams.get('state');
            const storedState = localStorage.getItem(`${service}_auth_state`);
            const codeVerifier = localStorage.getItem('code_verifier');

            const getInstance = () => {
                if (isBinding)
                    return instanceWithAuth;
                return instance;
            };

            const getRoute = () => {
                if (isBinding)
                    return getRouteProvider(service).bind;
                return getRouteProvider(service).auth;
            };

            try {
                if (state === null || state !== storedState) {
                    throw new Error(translations?.callback.errors.stateMismatch);
                }

                const response = await getInstance().post(getRoute(), {
                    code,
                    code_verifier: codeVerifier,
                    redirect_uri: getUri(service),
                });

                if (!response.status || response.status !== 200) {
                    throw new Error(translations?.callback.errors.tokenExchange);
                }

                if (!isBinding) {
                    setJsonWebToken(response?.data?.jwt);
                }

                localStorage.removeItem(`${service}_auth_state`);
                localStorage.removeItem('code_verifier');

                setTimeout(() => {
                    if (code && !error && state === storedState) {
                        sessionStorage.removeItem(`${service}_auth_state`);
                        navigate(isBinding ? '/account/me' : '/dashboard');
                    }
                }, 2000);
                return;
            } catch (error: unknown) {
                setError((error as Error)?.message || `${translations?.callback.errors.genericError}: ${capitalize(service)}`);
                setTimeout(() => {
                    navigate(isBinding ? '/account/me' : '/login');
                }, 2000);
            }
        };

        if (!hasHandledCallback.current && service) {
            handleCallback().catch(console.error);
            hasHandledCallback.current = true;
        }
    }, [service, navigate, setJsonWebToken]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Card style={{ width: 300, textAlign: 'center' }}>
                {error ? (
                    <>
                        <h3 style={{ color: '#ff4d4f' }}>
                            {error}
                        </h3>
                        <p>
                            {translations?.callback.redirect.message}
                        </p>
                    </>
                ) : (
                    <>
                        <Spin size="large" />
                        <h3 style={{ marginTop: 24 }}>
                            {translations?.callback.loading.title.replace('{service}', capitalize(service))}
                        </h3>
                        <p>
                            {translations?.callback.loading.description}
                        </p>
                    </>
                )}
            </Card>
        </div>
    );
};

export default GenericCallback;
