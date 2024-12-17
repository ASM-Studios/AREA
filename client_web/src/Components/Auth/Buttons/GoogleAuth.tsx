import { Form, Button } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { uri } from '@Config/uri';

interface GoogleAuthProps {
    onSuccess: (response: unknown) => void;
    onError: () => void;
    buttonText: string;
    disabled?: boolean;
}

const GoogleAuth = ({ onSuccess, onError, buttonText, disabled = false }: GoogleAuthProps) => {
    if (!uri.google.auth.clientId || uri.google.auth.clientId === '') {
        return null;
    }

    const handleGoogleLogin = () => {
        const google = (window as any).google;
        if (!google) {
            console.error('Google API not loaded');
            onError();
            return;
        }

        const client = google.accounts.oauth2.initCodeClient({
            client_id: uri.google.auth.clientId,
            scope: uri.google.auth.scope.join(' '),
            callback: (response: unknown) => {
                if (response && typeof response === 'object' && 'code' in response) {
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
                    disabled={disabled}
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
