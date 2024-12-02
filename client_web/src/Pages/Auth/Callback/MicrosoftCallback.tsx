import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { uri } from '../../../Config/uri.ts';

const MicrosoftCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const msalConfig = {
                auth: {
                    clientId: uri.microsoft.auth.clientId,
                    authority: "https://login.microsoftonline.com/common",
                    redirectUri: uri.microsoft.auth.redirectUri
                }
            };

            const msalInstance = new PublicClientApplication(msalConfig);

            try {
                await msalInstance.initialize();
                const response = await msalInstance.handleRedirectPromise();
                
                if (response) {
                    // TODO: Send the token to your backend

                    localStorage.setItem('microsoft_access_token', response.accessToken);

                    // navigate('/dashboard'); //TODO: The navigate function is to be put in the onSuccess function
                }
            } catch (error) {
                console.error('Microsoft authentication error:', error);
                navigate('/login');
            }
        };

        handleCallback().then(() => {});
    }, [navigate]);

    return null;
};

export default MicrosoftCallback;
