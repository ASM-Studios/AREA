import {Button, Form} from 'antd';

interface LinkedinAuthProps {
    onSuccess: (response: unknown) => void;
    onError: (error: unknown) => void;
    buttonText: string;
}

const LinkedinAuth = ({ buttonText }: LinkedinAuthProps) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    
    const handleLinkedinAuth = () => {
        const scope = 'r_liteprofile r_emailaddress';
        const state = Math.random().toString(36).substring(7);

        sessionStorage.setItem('linkedinState', state);

        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?` +
            `response_type=code&` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `state=${state}&` +
            `scope=${encodeURIComponent(scope)}`;
    };

    if (!clientId) {
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
