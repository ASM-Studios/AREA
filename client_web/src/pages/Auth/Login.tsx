import {Form, Input, Button, Card, Divider} from 'antd';
import { Link } from 'react-router-dom';
import GoogleAuth from '../../components/auth/GoogleAuth';
import MicrosoftAuth from '../../components/auth/MicrosoftAuth';
import LinkedinAuth from '../../components/auth/LinkedinAuth';
import SpotifyAuth from '../../components/auth/SpotifyAuth.tsx';

const Login = () => {
    const onFinish = (values: { email: string, password: string }) => {
        console.log('Success:', values);
        // TODO: Call login API function here
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    };

    const handleGoogleSuccess = (credentialResponse: unknown) => {
        console.log('Google Login Success:', credentialResponse);
        // Call your API to verify the Google token and log in the user
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
    };

    const handleMicrosoftSuccess = (response: unknown) => {
        console.log('Microsoft Login Success:', response);
        // Call your API to verify the Microsoft token and log in the user
    };

    const handleMicrosoftError = (error: unknown) => {
        console.error('Microsoft Login Failed:', error);
    };

    const handleLinkedinSuccess = (response: unknown) => {
        console.log('LinkedIn Login Success:', response);
        // Handle successful LinkedIn login
    };

    const handleLinkedinError = (error: unknown) => {
        console.error('LinkedIn Login Failed:', error);
    };

    return (
        <div style={{
            backgroundImage: 'url("/background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0
        }}>
            <Card title="Login" style={{ width: 400 }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please input your valid email!' }
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { pattern:
                                /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                                message: 'Password must contain at least one letter, one number, and one special character.'
                            },
                            { min: 8, message: 'Password must be at least 8 characters long.' }
                        ]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Login
                        </Button>
                    </Form.Item>

                    <Divider>Or</Divider>

                    <GoogleAuth
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        buttonText="signin_with"
                    />

                    <MicrosoftAuth
                        onSuccess={handleMicrosoftSuccess}
                        onError={handleMicrosoftError}
                        buttonText="Sign in with Microsoft"
                    />

                    <LinkedinAuth
                        onSuccess={handleLinkedinSuccess}
                        onError={handleLinkedinError}
                        buttonText="Sign in with LinkedIn"
                    />

                    <SpotifyAuth
                        buttonText="Sign in with Spotify"
                    />

                    <Form.Item>
                        <Link to="/register">
                            <Button type="link" style={{ padding: 0 }}>
                                I don't have an account
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login; 
