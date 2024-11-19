import { Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import GoogleAuth from '../../Components/auth/GoogleAuth';
import MicrosoftAuth from '../../Components/auth/MicrosoftAuth';

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

    return (
        <Card title="Register" style={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}>
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

                <Form.Item>
                    <Link to="/login">
                        <Button type="link" style={{ padding: 0 }}>
                            I already have an account
                        </Button>
                    </Link>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Register; 
