import { Form, Input, Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import OAuthButtons from '@/Components/Auth/OAuthButtons';
import { instance, auth } from "@Config/backend.routes";
import { useAuth, useUser } from "@/Context/ContextHooks";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Globe from "@/Components/eldora/globe";
import { useState } from 'react';

const Register = () => {
    const [form] = Form.useForm();
    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { translations } = useUser();
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

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

    const onFieldsChange = () => {
        const fieldsError = form.getFieldsError();
        const isValid = fieldsError.every(field => field.errors.length === 0) &&
            form.getFieldsValue(true).every((value: string | undefined) => value !== undefined && value !== '');
        setIsFormValid(isValid);
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
            left: 0,
            overflow: 'hidden'
        }} role="main">
            <div style={{
                position: 'relative',
                width: '50%',
                height: '100%',
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Globe />
            </div>

            <div style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card
                    title={translations?.authForm.register.title}
                    style={{
                        width: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        position: 'relative'
                    }}
                    headStyle={{
                        fontSize: '24px',
                        textAlign: 'center',
                        borderBottom: 'none',
                        padding: '24px 24px 0',
                    }}
                    bodyStyle={{
                        padding: '24px',
                    }}
                >
                    <Form
                        form={form}
                        name="register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onFieldsChange={onFieldsChange}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{
                            maxWidth: '100%',
                        }}
                    >
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label={translations?.authForm.register.form.username.label}
                                name="username"
                                rules={[{ required: true, message: translations?.authForm.register.form.username.validation.required }]}
                                tooltip={translations?.authForm.register.form.username.tooltip}
                                style={{ marginBottom: '12px', flex: 1 }}
                            >
                                <Input
                                    placeholder={translations?.authForm.register.form.username.placeholder}
                                    size="large"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={translations?.authForm.register.form.email.label}
                                name="email"
                                rules={[
                                    { required: true, message: translations?.authForm.register.form.email.validation.required },
                                    { type: 'email', message: translations?.authForm.register.form.email.validation.invalid }
                                ]}
                                tooltip={translations?.authForm.register.form.email.tooltip}
                                style={{ marginBottom: '12px', flex: 1 }}
                            >
                                <Input
                                    placeholder={translations?.authForm.register.form.email.placeholder}
                                    size="large"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label={translations?.authForm.register.form.password.label}
                                name="password"
                                rules={[
                                    { required: true, message: translations?.authForm.register.form.password.validation.required },
                                    { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                                        message: translations?.authForm.register.form.password.validation.pattern },
                                    { min: 8, message: translations?.authForm.register.form.password.validation.length }
                                ]}
                                tooltip={translations?.authForm.register.form.password.tooltip}
                                style={{ marginBottom: '12px', flex: 1 }}
                            >
                                <Input.Password
                                    placeholder={translations?.authForm.register.form.password.placeholder}
                                    size="large"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={translations?.authForm.register.form.confirmPassword.label}
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
                                style={{ marginBottom: '12px', flex: 1 }}
                            >
                                <Input.Password
                                    placeholder={translations?.authForm.register.form.confirmPassword.placeholder}
                                    size="large"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{
                                    width: '100%',
                                    height: '46px',
                                    borderRadius: '6px',
                                    border: 'none',
                                }}
                                disabled={!isFormValid}
                            >
                                {translations?.authForm.register.form.submitButton}
                            </Button>
                        </Form.Item>

                        <OAuthButtons
                            mode="signup"
                        />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                            <Link to="/login">
                                <Button
                                    type="link"
                                    style={{
                                        padding: '8px 0',
                                        fontSize: '14px',
                                        height: 'auto',
                                    }}
                                >
                                    {translations?.authForm.register.form.haveAccountLink}
                                </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
