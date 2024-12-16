/* eslint-disable @typescript-eslint/ban-ts-comment */
interface AuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
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
            redirectUri: `${window.location.origin}/auth/google/callback`
        }
    },
    microsoft: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/microsoft/callback`
        }
    },
    linkedin: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/linkedin/callback`
        }
    },
    spotify: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/spotify/callback`
        }
    },
    twitch: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_TWITCH_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_TWITCH_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/twitch/callback`
        }
    },
    discord: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_DISCORD_CLIENT_ID as string,
            clientSecret: "", // Not expected to be provided
            redirectUri: `${window.location.origin}/auth/discord/callback`
        }
    },
    github: {
        auth: {
            // @ts-expect-error
            clientId: import.meta.env.VITE_GITHUB_CLIENT_ID as string,
            // @ts-expect-error
            clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET as string,
            redirectUri: `${window.location.origin}/auth/github/callback`
        }
    }
};

export { uri };
