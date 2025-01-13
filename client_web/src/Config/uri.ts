/* eslint-disable @typescript-eslint/ban-ts-comment */
interface AuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string[];
}

interface UriConfig {
    google: { auth: AuthConfig };
    microsoft: { auth: AuthConfig };
    linkedin: { auth: AuthConfig };
    spotify: { auth: AuthConfig };
    twitch: { auth: AuthConfig };
    discord: { auth: AuthConfig };
    github: { auth: AuthConfig };
}

const uri: UriConfig = {
    google: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/google/callback`,
            scope: [
                'email profile',
                'https://mail.google.com/',
                'https://www.googleapis.com/auth/calendar',
            ]
        }
    },
    microsoft: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/microsoft/callback`,
            scope: [
                'user.read',
                'Mail.Read',
                'Mail.ReadWrite',
                'Mail.Send'
            ]
        }
    },
    linkedin: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/linkedin/callback`,
            scope: [
                'r_liteprofile',
                'r_emailaddress',
            ]
        }
    },
    spotify: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/spotify/callback`,
            scope: [
                'user-read-private',
                'user-read-email',
                'user-modify-playback-state',
                'user-read-playback-state',
                'playlist-read-private',
                'playlist-modify-public',
                'playlist-modify-private',
            ]
        }
    },
    twitch: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_TWITCH_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/twitch/callback`,
            scope: [
                'user:read:email',
                'user:write:chat',
                'user:manage:whispers'
            ]
        }
    },
    discord: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/discord/callback`,
            scope: [
                'identify',
                'email',
                'guilds',
            ]
        }
    },
    github: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_GITHUB_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/github/callback`,
            scope: [
                'read:user',
                'user:email',
                'repo'
            ]
        }
    }
};

export { uri };
