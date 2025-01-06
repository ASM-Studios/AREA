import { uri } from "@Config/uri";

const generateCodeChallenge = async (codeVerifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const handleDiscordLogin = () => {
    const state = crypto.randomUUID().substring(0, 16);
    localStorage.setItem('discord_auth_state', state);

    const authUrl = new URL('https://discord.com/api/oauth2/authorize');
    const params = {
        response_type: 'code',
        client_id: uri.discord.auth.clientId,
        scope: uri.discord.auth.scope.join(' '),
        redirect_uri: uri.discord.auth.redirectUri,
        state: state,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
};

const handleGithubLogin = () => {
    const state = crypto.randomUUID().substring(0, 16);
    localStorage.setItem('github_auth_state', state);

    const authUrl = new URL('https://github.com/login/oauth/authorize');
    const params = {
        client_id: uri.github.auth.clientId,
        redirect_uri: uri.github.auth.redirectUri,
        scope: uri.github.auth.scope.join(' '),
        state: state,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
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

const handleLinkedinAuth = () => {
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem('linkedinState', state);

    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${uri.linkedin.auth.clientId}&` +
        `redirect_uri=${encodeURIComponent(uri.linkedin.auth.redirectUri)}&` +
        `state=${state}&` +
        `scope=${encodeURIComponent(uri.linkedin.auth.scope.join(' '))}`; // TODO: Test without the uri encoding
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
        scope: uri.spotify.auth.scope.join(' '),
        redirect_uri: uri.spotify.auth.redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
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

interface AuthConfig {
    handler: () => void;
    disabled: boolean
    icon: string;
}

const config: Record<string, AuthConfig> = {
    "discord": {
        "handler": handleDiscordLogin,
        "disabled": [
            uri.discord.auth.clientId
        ].some(value => !value),
        "icon": "/discord-icon.png"
    },
    "github": {
        "handler": handleGithubLogin,
        "disabled": [
            uri.github.auth.clientId
        ].some(value => !value),
        "icon": "/github-icon.png"
    },
    "google": {
        "handler": handleGoogleLogin,
        "disabled": [
            uri.google.auth.clientId,
            uri.google.auth.clientSecret
        ].some(value => !value),
        "icon": "/google-icon.png"
    },
    "linkedin": {
        "handler": handleLinkedinAuth,
        "disabled": [
            uri.linkedin.auth.clientId,
            uri.linkedin.auth.clientSecret
        ].some(value => !value),
        "icon": "/linkedin-icon.png"
    },
    "microsoft": {
        "handler": handleMicrosoftLogin,
        "disabled": [
            uri.microsoft.auth.clientId
        ].some(value => !value),
        "icon": "/microsoft-icon.png"
    },
    "spotify": {
        "handler": handleSpotifyLogin,
        "disabled": [
            uri.spotify.auth.clientId
        ].some(value => !value),
        "icon": "/spotify-icon.png"
    },
    "twitch": {
        "handler": handleTwitchLogin,
        "disabled": [
            uri.twitch.auth.clientId,
            uri.twitch.auth.clientSecret
        ].some(value => !value),
        "icon": "/twitch-icon.png"
    },
};

export default config;
