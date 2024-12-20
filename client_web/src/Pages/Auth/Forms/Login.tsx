import {Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import OAuthButtons from '../../../Components/Auth/OAuthButtons';
import { instance, auth } from "@Config/backend.routes";
import { useAuth, useUser } from "@/Context/ContextHooks";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {
    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { translations } = useUser();

    const navigate = useNavigate();

    const onFinish = (values: { email: string, password: string }) => {
        instance.post(auth.login, values)
            .then((response) => {
                if (!response?.data?.jwt) {
                    console.error(translations?.authForm.login.errors.jwtNotFound);
                    return;
                }
                setJsonWebToken(response?.data?.jwt);
                setIsAuthenticated(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Failed:', error);
                toast.error(`${translations?.authForm.login.errors.loginFailed}: ${error?.response?.data?.error}`);
            });
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.error('Failed:', errorInfo);
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
            <Card title={translations?.authForm.login.title} style={{ width: 400 }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                >
                    <Form.Item
                        tooltip={translations?.authForm.login.form.email.tooltip}
                        name="email"
                        rules={[
                            { required: true, message: translations?.authForm.login.form.email.validation.required },
                            { type: 'email', message: translations?.authForm.login.form.email.validation.invalid }
                        ]}
                    >
                        <Input placeholder={translations?.authForm.login.form.email.placeholder} />
                    </Form.Item>

                    <Form.Item
                        tooltip={translations?.authForm.login.form.password.tooltip}
                        name="password"
                        rules={[
                            { required: true, message: translations?.authForm.login.form.password.validation.required },
                            { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                              message: translations?.authForm.login.form.password.validation.pattern
                            },
                            { min: 8, message: translations?.authForm.login.form.password.validation.length }
                        ]}
                    >
                        <Input.Password placeholder={translations?.authForm.login.form.password.placeholder} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            {translations?.authForm.login.form.submitButton}
                        </Button>
                    </Form.Item>

                    <OAuthButtons
                        mode="signin"
                    />

                    <Form.Item>
                        <Link to="/register">
                            <Button type="link" style={{ padding: 0 }}>
                                {translations?.authForm.login.form.noAccountLink}
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login; 
