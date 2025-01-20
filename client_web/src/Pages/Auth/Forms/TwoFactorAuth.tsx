import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { toast } from "react-toastify";
import { Form, Input, Card, InputRef } from 'antd';
import { instanceWithAuth, auth } from "@Config/backend.routes";
import { useAuth, useUser, useError } from "@/Context/ContextHooks";
import Globe from '@/Components/eldora/globe';
import Security from "@/Components/Security";

const TwoFactorAuth = () => {
    const [form] = Form.useForm();
    const { setIsAuthenticated, setJsonWebToken } = useAuth();
    const { translations, user, setUser, totpLoggingIn } = useUser();
    const { setError } = useError();
    const navigate = useNavigate();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const inputRefs = Array(6).fill(0).map(() => useRef<InputRef>(null));

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleInput = (index: number, value: string) => {
        const sanitizedValue = value.replace(/[^0-9]/g, '');

        if (sanitizedValue.length <= 1) {
            form.setFieldValue(`digit${index}`, sanitizedValue);

            if (sanitizedValue.length === 1 && index < 5) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !form.getFieldValue(`digit${index}`) && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const onFinish = (values: Record<string, string>) => {
        const code = Object.values(values).join('');

        instanceWithAuth.post(totpLoggingIn ? auth.twoFactorAuth.login : auth.twoFactorAuth.validate, { code })
            .then((response) => {
                setIsAuthenticated(true);
                toast.success(translations?.authForm.twoFactor.success.verified);

                if (totpLoggingIn) {
                    if (!response.data?.jwt) {
                        setError({error: 'Login Failed', errorDescription: 'JWT not found in response'});
                        navigate('/error/login');
                    }
                    setJsonWebToken(response?.data?.jwt);
                    setIsAuthenticated(true);
                }

                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('2FA Verification Failed:', error);
                toast.error(translations?.authForm.twoFactor.errors.verificationFailed);

                form.resetFields();
            });
    };

    const onFieldsChange = () => {
        const values = form.getFieldsValue();
        // @ts-expect-error type cannot be inferred
        const isComplete = Object.values(values).every(value => value?.length === 1);

        if (isComplete) {
            form.submit();
        }
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
            {!isMobile &&
                <>
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
                </>
            }

            <div style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card
                    title={translations?.authForm.twoFactor.title}
                    style={{
                        width: 400,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        position: 'relative'
                    }}
                    styles={{
                        header: {
                            fontSize: '24px',
                            textAlign: 'center',
                            borderBottom: 'none',
                            padding: '24px 24px 0',
                        },
                        body: {
                            padding: '24px',
                        }
                    }}
                >
                    <p style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {translations?.authForm.twoFactor.description}
                    </p>

                    <Form
                        form={form}
                        name="2fa"
                        onFinish={onFinish}
                        onFieldsChange={onFieldsChange}
                    >
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <React.Fragment key={index}>
                                    <Form.Item
                                        name={`digit${index}`}
                                        style={{marginBottom: 0}}
                                    >
                                        <Input
                                            ref={inputRefs[index]}
                                            maxLength={1}
                                            style={{
                                                width: '46px',
                                                height: '46px',
                                                textAlign: 'center',
                                                fontSize: '20px',
                                                borderRadius: '8px',
                                            }}
                                            onChange={(e) => handleInput(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            aria-label={`Digit ${index + 1} of verification code`}
                                        />
                                    </Form.Item>
                                    {index === 2 && <span
                                        style={{alignSelf: 'center', fontSize: '24px', margin: '0 16px'}}>-</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default TwoFactorAuth;
