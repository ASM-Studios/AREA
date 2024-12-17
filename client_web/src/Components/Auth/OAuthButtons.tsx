import GoogleAuth from './Buttons/GoogleAuth';
import MicrosoftAuth from './Buttons/MicrosoftAuth';
import LinkedinAuth from './Buttons/LinkedinAuth';
import SpotifyAuth from './Buttons/SpotifyAuth';
import DiscordAuth from './Buttons/DiscordAuth';
import GithubAuth from "./Buttons/GithubAuth";
import { Divider } from 'antd';

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
            />

            <MicrosoftAuth
                onSuccess={onMicrosoftSuccess}
                onError={onMicrosoftError}
                buttonText={`${withText} Microsoft`}
            />

            <LinkedinAuth
                onSuccess={onLinkedinSuccess}
                onError={onLinkedinError}
                buttonText={`${withText} LinkedIn`}
            />

            <SpotifyAuth
                buttonText={`${withText} Spotify`}
            />

            <DiscordAuth
                buttonText={`${withText} Discord`}
            />

            <GithubAuth
                buttonText={`${withText} Github`}
            />
        </>
    );
};

export default OAuthButtons; 
