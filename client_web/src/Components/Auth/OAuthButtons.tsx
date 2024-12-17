import GoogleAuth from './Buttons/GoogleAuth';
import MicrosoftAuth from './Buttons/MicrosoftAuth';
import LinkedinAuth from './Buttons/LinkedinAuth';
import SpotifyAuth from './Buttons/SpotifyAuth';
import DiscordAuth from './Buttons/DiscordAuth';
import GithubAuth from "./Buttons/GithubAuth";
import TwitchAuth from "./Buttons/TwitchAuth";
import { Divider } from 'antd';
import { useUser } from "@/Context/ContextHooks";
import { ServicesDescription } from "@/Context/Scopes/UserContext";

interface OAuthButtonsProps {
    mode: 'signin' | 'signup' | 'connect';
    onGoogleSuccess: (response: unknown) => void;
    onGoogleError: () => void;
    onMicrosoftSuccess: (response: unknown) => void;
    onMicrosoftError: (error: unknown) => void;
    onLinkedinSuccess: (response: unknown) => void;
    onLinkedinError: (error: unknown) => void;
}

const OAuthButtons = ({
    mode,
    onGoogleSuccess,
    onGoogleError,
    onMicrosoftSuccess,
    onMicrosoftError,
    onLinkedinSuccess,
    onLinkedinError
}: OAuthButtonsProps) => {
    const { user } = useUser();

    const services: ServicesDescription[] = mode === 'connect' ? user?.services || [] : [];

    let withText = "";
    switch (mode) {
        case 'signin':
            withText = "Sign in with";
            break;
        case 'signup':
            withText = "Sign up with";
            break;
        case 'connect':
            withText = "Connect with";
            break;
        default:
            withText = "Use";
            break;
    }

    return (
        <>
            {mode !== 'connect' && <Divider>Or</Divider>}

            <GoogleAuth
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                buttonText={`${withText} Google`}
                disabled={services.some((service) => service.name === 'google')}
            />

            <MicrosoftAuth
                onSuccess={onMicrosoftSuccess}
                onError={onMicrosoftError}
                buttonText={`${withText} Microsoft`}
                disabled={services.some((service) => service.name === 'microsoft')}
            />

            <LinkedinAuth
                onSuccess={onLinkedinSuccess}
                onError={onLinkedinError}
                buttonText={`${withText} LinkedIn`}
                disabled={services.some((service) => service.name === 'linkedin')}
            />

            <SpotifyAuth
                buttonText={`${withText} Spotify`}
                disabled={services.some((service) => service.name === 'spotify')}
            />

            <DiscordAuth
                buttonText={`${withText} Discord`}
                disabled={services.some((service) => service.name === 'discord')}
            />

            <GithubAuth
                buttonText={`${withText} Github`}
                disabled={services.some((service) => service.name === 'github')}
            />

            <TwitchAuth
                buttonText={`${withText} Twitch`}
                disabled={services.some((service) => service.name === 'twitch')}
            />
        </>
    );
};

export default OAuthButtons; 
