import {Button, Form} from 'antd';
// @ts-ignore
import { uri } from '@Config/uri';

interface LinkedinAuthProps {
    onSuccess: (response: unknown) => void;
    onError: (error: unknown) => void;
    buttonText: string;
}

const LinkedinAuth = ({ buttonText }: LinkedinAuthProps) => {
    const handleLinkedinAuth = () => {
        const scope = 'r_liteprofile r_emailaddress';
        const state = Math.random().toString(36).substring(7);

        sessionStorage.setItem('linkedinState', state);

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${uri.linkedin.auth.clientId}&` +
            `redirect_uri=${encodeURIComponent(uri.linkedin.auth.redirectUri)}&` +
            `state=${state}&` +
            `scope=${encodeURIComponent(scope)}`;
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
                >
                    {buttonText}
                </Button>
            </Form.Item>
        </>
    );
};

export default LinkedinAuth;
