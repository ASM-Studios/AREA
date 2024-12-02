import { Form, Button } from 'antd';
import { PublicClientApplication } from '@azure/msal-browser';
import { useEffect, useState } from 'react';
// @ts-ignore
import { uri } from '@Config/uri';

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
                clientId: uri.microsoft.auth.clientId,
                authority: "https://login.microsoftonline.com/common",
                redirectUri: uri.microsoft.auth.redirectUri
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

    if (!uri.microsoft.auth.clientId || !msalInstance) {
        return null;
    }

    return (
        <>
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
