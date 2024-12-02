import { Form, Button } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
// @ts-ignore
import { uri } from '@Config/uri';

interface GoogleAuthProps {
    onSuccess: (response: unknown) => void;
    onError: () => void;
    buttonText: string;
}

const GoogleAuth = ({ onSuccess, onError, buttonText }: GoogleAuthProps) => {
    if (!uri.google.auth.clientId || uri.google.auth.clientId === '') {
        return null;
    }

    const handleGoogleLogin = () => {
        // Initialize the Google Sign-In client
        let google: any;
        const client = google.accounts.oauth2.initCodeClient({
            client_id: uri.google.auth.clientId,
            scope: 'email profile', // TODO: Add other scopes as needed
            callback: (response: unknown) => {
                // @ts-ignore
                if (response?.code) {
                    onSuccess(response);
                } else {
                    onError();
                }
            },
        });
        client.requestCode();
    };

    return (
        <GoogleOAuthProvider clientId={uri.google.auth.clientId}>
            <Form.Item style={{ textAlign: 'center' }}>
                <Button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors border border-gray-300"
                >
                    <img
                        src="/google-icon.png"
                        alt="Google Logo"
                        style={{ width: '24px', height: '24px' }}
                    />
                    {buttonText}
                </Button>
            </Form.Item>
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth; 
