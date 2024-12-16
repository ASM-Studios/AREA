import { Form, Button } from 'antd';
import { FC } from 'react';
import { uri } from '@Config/uri';

interface GithubAuthProps {
    buttonText: string;
}

const GithubAuth: FC<GithubAuthProps> = ({ buttonText }) => {
    const scope = [
        'read:user',
        'user:email',
        // Add other scopes as needed
    ].join(' ');

    const handleGithubLogin = () => {
        const state = crypto.randomUUID().substring(0, 16);
        localStorage.setItem('github_auth_state', state);

        const authUrl = new URL('https://github.com/login/oauth/authorize');
        const params = {
            client_id: uri.github.auth.clientId,
            redirect_uri: uri.github.auth.redirectUri,
            scope: scope,
            state: state,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    if (!uri.github.auth.clientId) {
        return null;
    }

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#24292e] text-white py-2 px-4 rounded-md hover:bg-[#2f363d] transition-colors"
            >
                <img
                    src="/github-icon.png"
                    alt="GitHub Logo"
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default GithubAuth;
