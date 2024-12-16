import { Form, Button } from 'antd';
import { FC } from 'react';
// @ts-ignore
import { uri } from '@Config/uri';

interface SpotifyOAuthProps {
    buttonText: string;
}

const SpotifyAuth: FC<SpotifyOAuthProps> = ({ buttonText }) => {

    const scope = [
        'user-read-private',
        'user-read-email',
        // TODO: Add other scopes as needed
    ].join(' ');

    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const handleSpotifyLogin = async () => {
        const state = crypto.randomUUID().substring(0, 16);
        const codeVerifier = crypto.randomUUID() + crypto.randomUUID();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        localStorage.setItem('spotify_auth_state', state);
        localStorage.setItem('code_verifier', codeVerifier);

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        const params = {
            response_type: 'code',
            client_id: uri.spotify.auth.clientId,
            scope: scope,
            redirect_uri: uri.spotify.auth.redirectUri,
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
                onClick={handleSpotifyLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#1DB954] text-white py-2 px-4 rounded-md hover:bg-[#1ed760] transition-colors"
            >
                <img
                    src="/spotify-logo.png"
                    alt="Spotify Logo"
                    style={{ width: '24px', height: '24px' }}
                />
                {buttonText}
            </Button>
        </Form.Item>
    );
};

export default SpotifyAuth;
