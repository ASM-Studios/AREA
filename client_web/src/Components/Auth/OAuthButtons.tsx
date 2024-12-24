import React from "react";
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
import { BaseAuthProps } from "@/Components/Auth/auth.types";

interface OAuthButtonsProps {
    mode: 'signin' | 'signup' | 'connect';
}

const OAuthButtonsMap: { [key: string]: React.FC<BaseAuthProps> } = {
    google: GoogleAuth,
    microsoft: MicrosoftAuth,
    spotify: SpotifyAuth,
    linkedin: LinkedinAuth,
    discord: DiscordAuth,
    github: GithubAuth,
    twitch: TwitchAuth,
};

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

            {Object.keys(OAuthButtonsMap).map((service) => {
                const Component = OAuthButtonsMap[service];
                return (
                    <Component
                        key={service}
                        buttonText={`${withText} ${service.charAt(0).toUpperCase() + service.slice(1)}`}
                        disabled={services.some((s) => s.name === service)}
                    />
                );
            })}
        </>
    );
};

export default OAuthButtons;
