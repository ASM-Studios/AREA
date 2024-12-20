import { Form, Button } from 'antd';
import { FC } from 'react';

interface OAuthConfig {
    clientId: string;
    scope: string[];
    redirectUri: string;
    authUrl: string;
    requiresPKCE?: boolean;
    additionalParams?: Record<string, string>;
}

interface GenericOAuthButtonProps {
    buttonText: string;
    disabled?: boolean;
    service: string;
    config: OAuthConfig;
    className?: string;
    iconSrc: string;
}

const GenericOAuthButton: FC<GenericOAuthButtonProps> = ({
    buttonText,
    disabled = false,
    service,
    config,
    className,
    iconSrc,
}) => {
    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleLogin = async () => {
        const state = crypto.randomUUID().substring(0, 16);
        localStorage.setItem(`${service}_auth_state`, state);

        let params: Record<string, string> = {
            response_type: 'code',
            client_id: config.clientId,
            scope: config.scope.join(' '),
            redirect_uri: config.redirectUri,
            state: state,
            ...config.additionalParams,
        };

        if (config.requiresPKCE) {
            const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            localStorage.setItem('code_verifier', codeVerifier);
            
            params = {
                ...params,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge,
            };
        }

        const authUrl = new URL(config.authUrl);
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    if (!config.clientId) {
        return null;
    }

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleLogin}
                className={className}
                disabled={disabled}
            >
                <img
                    src={iconSrc}
                    alt={`${service} Logo`}
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default GenericOAuthButton;
