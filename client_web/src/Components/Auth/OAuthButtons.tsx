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
}

const OAuthButtons = ({
    mode,
}: OAuthButtonsProps) => {
    const { user, translations } = useUser();

    const services: ServicesDescription[] = mode === 'connect' ? user?.services || [] : [];

    let withText = "";
    switch (mode) {
        case 'signin':
            withText = translations?.oauthButtons.signin;
            break;
        case 'signup':
            withText = translations?.oauthButtons.signup;
            break;
        case 'connect':
            withText = translations?.oauthButtons.connect;
            break;
        default:
            withText = translations?.oauthButtons.use;
            break;
    }

    return (
        <>
            {mode !== 'connect' && <Divider>{translations?.oauthButtons.or}</Divider>}

            <GoogleAuth
                buttonText={`${withText} Google`}
                disabled={services.some((service) => service.name === 'google')}
            />

            <MicrosoftAuth
                buttonText={`${withText} Microsoft`}
                disabled={services.some((service) => service.name === 'microsoft')}
            />

            <LinkedinAuth
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
