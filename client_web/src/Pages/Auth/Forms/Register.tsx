import { Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import OAuthButtons from '@/Components/Auth/OAuthButtons';
import { instance, auth } from "@Config/backend.routes";
import { useAuth, useUser } from "@/Context/ContextHooks";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Register = () => {
    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { translations } = useUser();
    const navigate = useNavigate();

    const onFinish = (values: unknown) => {
        instance.post(auth.register, values)
            .then((response) => {
                if (!response?.data?.jwt) {
                    console.error(translations?.authForm.register.errors.jwtNotFound);
                    return;
                }
                toast.success(translations?.authForm.register.success.registered);
                setJsonWebToken(response?.data?.jwt);
                setIsAuthenticated(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Failed:', error);
                toast.error(`${translations?.authForm.register.errors.registerFailed}: ${error?.response?.data?.error}`);
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
            <Card title={translations?.authForm.register.title} style={{ width: 400 }}>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: translations?.authForm.register.form.username.validation.required }]}
                        tooltip={translations?.authForm.register.form.username.tooltip}
                    >
                        <Input placeholder={translations?.authForm.register.form.username.placeholder} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: translations?.authForm.register.form.email.validation.required },
                            { type: 'email', message: translations?.authForm.register.form.email.validation.invalid }
                        ]}
                        tooltip={translations?.authForm.register.form.email.tooltip}
                    >
                        <Input placeholder={translations?.authForm.register.form.email.placeholder} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: translations?.authForm.register.form.password.validation.required },
                            { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                              message: translations?.authForm.register.form.password.validation.pattern },
                            { min: 8, message: translations?.authForm.register.form.password.validation.length }
                        ]}
                        tooltip={translations?.authForm.register.form.password.tooltip}
                    >
                        <Input.Password placeholder={translations?.authForm.register.form.password.placeholder} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: translations?.authForm.register.form.confirmPassword.validation.required },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(translations?.authForm.register.form.confirmPassword.validation.match));
                                },
                            }),
                        ]}
                        tooltip={translations?.authForm.register.form.confirmPassword.tooltip}
                    >
                        <Input.Password placeholder={translations?.authForm.register.form.confirmPassword.placeholder} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            {translations?.authForm.register.form.submitButton}
                        </Button>
                    </Form.Item>

                    <OAuthButtons
                        mode="signup"
                    />

                    <Form.Item>
                        <Link to="/login">
                            <Button type="link" style={{ padding: 0 }}>
                                {translations?.authForm.register.form.haveAccountLink}
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register; 
