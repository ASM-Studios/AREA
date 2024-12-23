import { Form, Button } from 'antd';
import { FC } from 'react';
import { uri } from '@Config/uri';

interface GoogleAuthProps {
    buttonText: string;
    disabled?: boolean;
}

const GoogleAuth: FC<GoogleAuthProps> = ({ buttonText, disabled = false }) => {
    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleGoogleLogin = async () => {
        const state = crypto.randomUUID().substring(0, 16);
        const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('google_auth_state', state);
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        const params = {
            response_type: 'code',
            client_id: uri.google.auth.clientId,
            scope: uri.google.auth.scope.join(' '),
            redirect_uri: uri.google.auth.redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            access_type: 'offline',
            prompt: 'consent'
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    if (!uri.google.auth.clientId) {
        return null;
    }

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
                disabled={disabled}
            >
                <img
                    src="/google-icon.png"
                    alt="Google Logo"
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default GoogleAuth; 
