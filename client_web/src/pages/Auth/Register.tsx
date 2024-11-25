import { Form, Input, Button, Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import GoogleAuth from '../../components/auth/GoogleAuth';
import MicrosoftAuth from '../../components/auth/MicrosoftAuth';
import LinkedinAuth from "../../components/auth/LinkedinAuth.tsx";
import SpotifyAuth from "../../components/auth/SpotifyAuth.tsx";

const Register = () => {
    const onFinish = (values: unknown) => {
        console.log('Success:', values);
        // TODO: Call register API function here
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    };

    const handleGoogleSuccess = (credentialResponse: unknown) => {
        console.log('Google Register Success:', credentialResponse);
        // Call your API to verify the Google token and register the user
    };

    const handleGoogleError = () => {
        console.log('Google Register Failed');
    };

    const handleMicrosoftSuccess = (response: unknown) => {
        console.log('Microsoft Register Success:', response);
        // Call your API to verify the Microsoft token and register the user
    };

    const handleMicrosoftError = (error: unknown) => {
        console.error('Microsoft Register Failed:', error);
    };

    const handleLinkedinSuccess = (response: unknown) => {
        console.log('LinkedIn Register Success:', response);
        // Call your API to verify the LinkedIn token and register the user
    };

    const handleLinkedinError = (error: unknown) => {
        console.error('LinkedIn Register Failed:', error);
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
            <Card title="Register" style={{ width: 400 }}>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                            message: 'Password must contain at least one letter, one number, and one special character.' },
                            { min: 8, message: 'Password must be at least 8 characters long.' }
                        ]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Register
                        </Button>
                    </Form.Item>

                    <Divider>Or</Divider>

                    <GoogleAuth
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        buttonText="signup_with"
                    />

                    <MicrosoftAuth
                        onSuccess={handleMicrosoftSuccess}
                        onError={handleMicrosoftError}
                        buttonText="Sign up with Microsoft"
                    />

                    <LinkedinAuth
                        onSuccess={handleLinkedinSuccess}
                        onError={handleLinkedinError}
                        buttonText="Sign up with LinkedIn"
                    />

                    <SpotifyAuth
                        buttonText="Sign in with Spotify"
                    />

                    <Form.Item>
                        <Link to="/login">
                            <Button type="link" style={{ padding: 0 }}>
                                I already have an account
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register; 
