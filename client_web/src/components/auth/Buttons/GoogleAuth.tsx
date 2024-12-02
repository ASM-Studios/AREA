import { Form } from 'antd';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
// @ts-ignore
import { uri } from '@Config/uri';

interface GoogleAuthProps {
    onSuccess: (response: unknown) => void;
    onError: () => void;
    buttonText?: string;
}

const GoogleAuth = ({ onSuccess, onError, buttonText = "signin_with"}: GoogleAuthProps) => {
    if (!uri.google.auth.clientId || uri.google.auth.clientId === '') {
        return null;
    }

    return (
        <GoogleOAuthProvider clientId={ uri.google.auth.clientId }>
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
