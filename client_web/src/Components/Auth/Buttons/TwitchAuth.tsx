import { Form, Button } from 'antd';
import { FC } from 'react';
import { uri } from '@Config/uri';

interface TwitchOAuthProps {
    buttonText: string;
    disabled?: boolean;
}

const TwitchAuth: FC<TwitchOAuthProps> = ({ buttonText, disabled = false }) => {
   const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleTwitchLogin = async () => {
        const state = crypto.randomUUID().substring(0, 16);
        const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('twitch_auth_state', state);
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
        const params = {
            response_type: 'code',
            client_id: uri.twitch.auth.clientId,
            scope: uri.twitch.auth.scope.join(' '),
            redirect_uri: uri.twitch.auth.redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    const exchangeCodeForToken = async (code: string) => {
        const codeVerifier = localStorage.getItem('code_verifier');
        if (!codeVerifier) {
            throw new Error('Code verifier not found in local storage');
        }

        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: uri.twitch.auth.clientId,
                client_secret: uri.twitch.auth.clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: uri.twitch.auth.redirectUri,
                code_verifier: codeVerifier,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    if (code && state === localStorage.getItem('twitch_auth_state')) {
        exchangeCodeForToken(code).then(() => {});
    }

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleTwitchLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#9146FF] text-white py-2 px-4 rounded-md hover:bg-[#A970FF] transition-colors"
                disabled={disabled}
            >
                <img
                    src="/twitch-icon.png"
                    alt="Twitch Logo"
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default TwitchAuth;
