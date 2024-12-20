import { Form, Button } from 'antd';
import { FC } from 'react';
// @ts-ignore
import { uri } from '@Config/uri';

interface DiscordAuthProps {
    buttonText: string;
}

const DiscordAuth: FC<DiscordAuthProps> = ({ buttonText }) => {
    const scope = [
        'identify',
        'email',
        'guilds',
        // TODO: Add other scopes as needed
    ].join(' ');

    const handleDiscordLogin = () => {
        const state = crypto.randomUUID().substring(0, 16);
        localStorage.setItem('discord_auth_state', state);

        const authUrl = new URL('https://discord.com/api/oauth2/authorize');
        const params = {
            response_type: 'code',
            client_id: uri.discord.auth.clientId,
            scope: scope,
            redirect_uri: uri.discord.auth.redirectUri,
            state: state,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    if (!uri.discord.auth.clientId) {
        return null;
    }

    return (
        <Form.Item style={{ textAlign: 'center' }}>
            <Button
                onClick={handleDiscordLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white py-2 px-4 rounded-md hover:bg-[#4752C4] transition-colors"
            >
                <img
                    src="/discord-icon.png"
                    alt="Discord Logo"
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default DiscordAuth; 
