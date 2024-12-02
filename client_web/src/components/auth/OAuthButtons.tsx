import GoogleAuth from './Buttons/GoogleAuth.tsx';
import MicrosoftAuth from './Buttons/MicrosoftAuth.tsx';
import LinkedinAuth from './Buttons/LinkedinAuth.tsx';
import SpotifyAuth from './Buttons/SpotifyAuth.tsx';
import DiscordAuth from './Buttons/DiscordAuth.tsx';
import { Divider } from 'antd';

interface OAuthButtonsProps {
    mode: 'signin' | 'signup';
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
    return (
        <>
            <Divider>Or</Divider>

            <GoogleAuth
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                buttonText={`${mode}_with`}
            />

            <MicrosoftAuth
                onSuccess={onMicrosoftSuccess}
                onError={onMicrosoftError}
                buttonText={`Sign ${mode === 'signin' ? 'in' : 'up'} with Microsoft`}
            />

            <LinkedinAuth
                onSuccess={onLinkedinSuccess}
                onError={onLinkedinError}
                buttonText={`Sign ${mode === 'signin' ? 'in' : 'up'} with LinkedIn`}
            />

            <SpotifyAuth
                buttonText={`Sign ${mode === 'signin' ? 'in' : 'up'} with Spotify`}
            />

            <DiscordAuth
                buttonText={`Sign ${mode === 'signin' ? 'in' : 'up'} with Discord`}
            />
        </>
    );
};

export default OAuthButtons; 
