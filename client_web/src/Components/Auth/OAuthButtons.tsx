import React, { useMemo } from "react";
import { Divider } from 'antd';
import { useUser } from "@/Context/ContextHooks";
import GenericOAuthButton from './Buttons/GenericOAuth';
import config from "@/Components/Auth/Buttons/config";

type OAuthMode = 'signin' | 'signup' | 'connect';

interface OAuthButtonsProps {
    mode: OAuthMode;
    className?: string;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({
    mode,
    className,
}) => {
    const { user, translations } = useUser();

    const services = useMemo(() => 
        mode === 'connect' ? user?.services || [] : [],
        [mode, user?.services]
    );

    const withText = useMemo(() => ({
        signin: translations?.oauthButtons.signin,
        signup: translations?.oauthButtons.signup,
        connect: translations?.oauthButtons.connect,
        default: translations?.oauthButtons.use,
    }[mode] || translations?.oauthButtons.use), 
    [mode, translations?.oauthButtons]);

    const buttons = useMemo(() => 
        Object.entries(config)
            .filter(([_, { disabled }]) => !disabled)
            .map(([service, { icon, handler }]) => ({
                key: service,
                service,
                buttonText: `${withText} ${service.charAt(0).toUpperCase() + service.slice(1)}`,
                disabled: services.some((s) => s.name === service),
                handleLogin: handler,
                iconSrc: icon,
            })),
        [config, services, withText]
    );

    if (!buttons.length) {
        return null;
    }

    return (
        <div className={className}>
            {mode !== 'connect' && translations?.oauthButtons.or && (
                <Divider>{translations.oauthButtons.or}</Divider>
            )}

            {buttons.map((buttonProps) => (
                <GenericOAuthButton
                    {...buttonProps}
                />
            ))}
        </div>
    );
};

export default React.memo(OAuthButtons);
