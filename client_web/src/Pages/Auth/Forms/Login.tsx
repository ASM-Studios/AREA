import {Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import OAuthButtons from '../../../Components/Auth/OAuthButtons';
import { instance, auth, oauth } from "@Config/backend.routes";
import { useAuth } from "@/Context/ContextHooks";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {
    const { setJsonWebToken, isAuthenticated, setIsAuthenticated } = useAuth();

    const navigate = useNavigate();

    const onFinish = (values: { email: string, password: string }) => {
        instance.post(auth.login, values)
            .then((response) => {
                if (!response?.data?.jwt) {
                    console.error('JWT not found in response');
                    return;
                }
                setJsonWebToken(response?.data?.jwt);
                setIsAuthenticated(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Failed:', error);
                toast.error('Failed to login: ' + error?.response?.data?.error);
            });
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.error('Failed:', errorInfo);
    };

    const handleGoogleSuccess = (credentialResponse: unknown) => {
        console.log('Google Login Success:', credentialResponse);
        // Call your API to verify the Google token and log in the user
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
    };

    const handleMicrosoftSuccess = (response: unknown) => {
        // @ts-expect-error response isn't typed
        instance.post(oauth.microsoft, { "token": response?.accessToken }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response?.data?.jwt) {
                    console.error('JWT not found in response');
                    return;
                }
                setJsonWebToken(response?.data?.jwt);
                setIsAuthenticated(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Failed:', error);
                toast.error('Failed to register: ' + (error?.response?.data?.error || 'Network error'));
            });
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
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0
        }} role="main">
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

                    <OAuthButtons
                        mode="signin"
                        onGoogleSuccess={handleGoogleSuccess}
                        onGoogleError={handleGoogleError}
                        onMicrosoftSuccess={handleMicrosoftSuccess}
                        onMicrosoftError={handleMicrosoftError}
                        onLinkedinSuccess={handleLinkedinSuccess}
                        onLinkedinError={handleLinkedinError}
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
