import { Form, Button } from 'antd';
import { useEffect, useState } from 'react';
import { uri } from '@Config/uri';

interface MicrosoftAuthProps {
    buttonText: string;
    disabled?: boolean;
}

const MicrosoftAuth = ({ buttonText, disabled = false }: MicrosoftAuthProps) => {
    const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleMicrosoftLogin = async () => {
        const state = crypto.randomUUID().substring(0, 16);
        const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('microsoft_auth_state', state);
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
        const params = {
            response_type: 'code',
            client_id: uri.microsoft.auth.clientId,
            scope: uri.microsoft.auth.scope.join(' '),
            redirect_uri: uri.microsoft.auth.redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleMicrosoftLogin}
                icon={<img
                    src="/microsoft-icon.png"
                    alt="Microsoft"
                    style={{ width: '20px', marginRight: '8px' }}
                />}
                disabled={disabled}
            >
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default MicrosoftAuth;
