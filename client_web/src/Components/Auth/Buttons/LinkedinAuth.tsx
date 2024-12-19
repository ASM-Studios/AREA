import {Button, Form} from 'antd';
import { uri } from '@Config/uri';

interface LinkedinAuthProps {
    buttonText: string;
    disabled?: boolean;
}

const LinkedinAuth = ({ buttonText, disabled = false }: LinkedinAuthProps) => {
    const handleLinkedinAuth = () => {
        const state = Math.random().toString(36).substring(7);

        sessionStorage.setItem('linkedinState', state);

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${uri.linkedin.auth.clientId}&` +
            `redirect_uri=${encodeURIComponent(uri.linkedin.auth.redirectUri)}&` +
            `state=${state}&` +
            `scope=${encodeURIComponent(uri.linkedin.auth.scope.join(' '))}`; // TODO: Test without the uri encoding
    };

    if (!uri.linkedin.auth.clientId) {
        return null;
    }

    return (
        <>
            <Form.Item style={{ textAlign: 'center' }}>
                <Button
                    onClick={handleLinkedinAuth}
                    icon={<img
                        src="/linkedin-icon.png"
                        alt="LinkedIn"
                        style={{ width: '20px', marginRight: '8px' }}
                    />}
                    disabled={disabled}
                >
                    {buttonText}
                </Button>
            </Form.Item>
        </>
    );
};

export default LinkedinAuth;
