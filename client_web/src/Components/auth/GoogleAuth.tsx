import { Form, Divider } from 'antd';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthProps {
    onSuccess: (response: unknown) => void;
    onError: () => void;
    buttonText?: string;
}

const GoogleAuth = ({ onSuccess, onError, buttonText = "signin_with"}: GoogleAuthProps) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const googleClientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

    if (!googleClientId || googleClientId === '') {
        return null;
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Divider>Or</Divider>
            <Form.Item style={{ textAlign: 'center' }}>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                    useOneTap
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    text={buttonText}
                />
            </Form.Item>
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth; 
