import { Form, Button, Divider } from 'antd';
import { PublicClientApplication } from '@azure/msal-browser';
import { useEffect, useState } from 'react';

interface MicrosoftAuthProps {
    onSuccess: (response: unknown) => void;
    onError: (error: unknown) => void;
    buttonText: string;
}

const MicrosoftAuth = ({ onSuccess, onError, buttonText }: MicrosoftAuthProps) => {
    const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

    useEffect(() => {
        const msalConfig = {
            auth: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID as string,
                authority: "https://login.microsoftonline.com/common",
                redirectUri: "https://localhost:" + window.location.port
            }
        };

        const msalInstance = new PublicClientApplication(msalConfig);
        msalInstance.initialize().then(() => {
            setMsalInstance(msalInstance);
        });
    }, []);

    const handleMicrosoftAuth = async () => {
        try {
            if (!msalInstance) {
                throw new Error('MSAL not initialized');
            }
            const response = await msalInstance.loginPopup({
                scopes: ["user.read"]
            });
            onSuccess(response);
        } catch (error) {
            onError(error);
        }
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!import.meta.env.VITE_MICROSOFT_CLIENT_ID || !msalInstance) {
        return null;
    }

    return (
        <>
            <Divider>Or</Divider>
            <Form.Item style={{ textAlign: 'center' }}>
                <Button
                    onClick={handleMicrosoftAuth}
                    icon={<img
                        src="/microsoft-icon.png"
                        alt="Microsoft"
                        style={{ width: '20px', marginRight: '8px' }}
                    />}
                >
                    {buttonText}
                </Button>
            </Form.Item>
        </>
    );
};

export default MicrosoftAuth; 