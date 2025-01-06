import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import { toast } from "react-toastify";
import OAuthButtons from '../../../Components/Auth/OAuthButtons';
import { instance, auth } from "@Config/backend.routes";
import { useAuth, useUser } from "@/Context/ContextHooks";
import { useNavigate } from 'react-router-dom';
import Globe from '../../../Components/eldora/globe';

const Login = () => {
    const [form] = Form.useForm();
    const { setJsonWebToken, setIsAuthenticated } = useAuth();
    const { translations } = useUser();
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);

    React.useEffect(() => {
        onFieldsChange();
    }, [])

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

    const onFieldsChange = () => {
        const fieldsError = form.getFieldsError();
        const values = form.getFieldsValue();

        setIsFormValid(
            !Object.values(values).some(value => !value)
            && fieldsError.every(field => field.errors.length === 0)
        );
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
                    title={translations?.authForm.login.title}
                    style={{
                        width: 400,
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
                        name="login"
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
                        <Form.Item
                            label={translations?.authForm.login.form.email.label}
                            tooltip={translations?.authForm.login.form.email.tooltip}
                            name="email"
                            rules={[
                                { required: true, message: translations?.authForm.login.form.email.validation.required },
                                { type: 'email', message: translations?.authForm.login.form.email.validation.invalid }
                            ]}
                            style={{ marginBottom: '12px' }}
                        >
                            <Input
                                placeholder={translations?.authForm.login.form.email.placeholder}
                                size="large"
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label={translations?.authForm.login.form.password.label}
                            tooltip={translations?.authForm.login.form.password.tooltip}
                            name="password"
                            rules={[
                                { required: true, message: translations?.authForm.login.form.password.validation.required },
                                { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/,
                                    message: translations?.authForm.login.form.password.validation.pattern
                                },
                                { min: 8, message: translations?.authForm.login.form.password.validation.length }
                            ]}
                            style={{ marginBottom: '12px' }}
                        >
                            <Input.Password
                                placeholder={translations?.authForm.login.form.password.placeholder}
                                size="large"
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>

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
                                {translations?.authForm.login.form.submitButton}
                            </Button>
                        </Form.Item>

                        <OAuthButtons mode="signin" />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                            <Link to="/register">
                                <Button
                                    type="link"
                                    style={{
                                        padding: '8px 0',
                                        fontSize: '14px',
                                        height: 'auto',
                                    }}
                                >
                                    {translations?.authForm.login.form.noAccountLink}
                                </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
