import React, { useState } from "react";
import { Col, Card, Space, Avatar, Typography, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "@/Context/ContextHooks";
import { auth, instanceWithAuth } from "@Config/backend.routes";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import {toast} from "react-toastify";

const { Text } = Typography;

interface ProfileCardProps {
    handleLogout: () => void;
    hoverCount: number;
    setHoverCount: (count: number) => void;
    hoverLimit: number;
    setNeedReload: (value: boolean) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ handleLogout, hoverCount, setHoverCount, hoverLimit, setNeedReload }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [modalSecret, setModalSecret] = useState<string>("");
    const [isQrModalVisible, setIsQrModalVisible] = useState<boolean>(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
    const [isEmailValidationLoading, setIsEmailValidationLoading] = useState<boolean>(false);

    const { user, setUser, translations, setValidating2faMethod } = useUser();
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (hoverCount < hoverLimit) {
            setHoverCount(hoverCount + 1);
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            setPosition({ top: randomTop, left: randomLeft });
        } else {
            setPosition(null);
        }
    };

    const handleOpenSettings = () => {
        setIsSettingsModalVisible(true);
    };

    const handleVerifyEmail = () => {
        setIsEmailValidationLoading(true);
        instanceWithAuth.get(auth.twoFactorAuth.generate_email)
            .then(() => {
                setValidating2faMethod("mail");
                navigate('/2fa');
                setIsEmailValidationLoading(false);
                setNeedReload(true);
            })
            .catch((error) => {
                console.error('Failed to send verification email:', error);
                setIsEmailValidationLoading(false);
            });
    };

    const handleEmailAuth = () => {
        instanceWithAuth.post(auth.twoFactorAuth.select, { method: "mail" })
            .then(() => {
                setNeedReload(true);
                toast.success("Email authentication enabled");
            })
            .catch((error) => {
                console.error('Failed to enable email auth:', error);
            });
    };

    const handleDisable2FA = () => {
        instanceWithAuth.post(auth.twoFactorAuth.select, { method: "none" })
            .then(() => {
                setNeedReload(true);
                toast.success("2FA disabled");
            })
            .catch((error) => {
                console.error('Failed to disable 2FA:', error);
            });
    };

    const handleActivateTOTP = () => {
        if (user?.two_factor_method === "none") {
            instanceWithAuth.get(auth.twoFactorAuth.generate_totp)
                .then((response) => {
                    setValidating2faMethod("totp");
                    setQrCodeUrl(response.data.url);
                    setModalSecret(response.data.secret);
                    setIsQrModalVisible(true);
                    setIsSettingsModalVisible(false);
                })
                .catch((error) => {
                    console.error('Failed to get 2FA QR code:', error);
                });
        }
    };

    const handleContinue = () => {
        setIsQrModalVisible(false);
        navigate("/2fa");
    };

    return (
        <Col xs={24} md={12}>
            <Card title={translations?.userPage?.profileCard?.title} style={{ padding: '16px', height: '100%', position: 'relative' }}>
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <Text strong>{translations?.userPage?.profileCard?.welcomeMessage.replace('{name}', user?.username || 'User')}</Text>
                    <Text>{translations?.userPage?.profileCard?.description}</Text>
                </Space>
                <Space direction="vertical" align="center" style={{ width: "100%", paddingTop: "20px" }}>
                    <Button
                        type="default"
                        onClick={handleOpenSettings}
                        style={{ marginTop: '10px' }}
                    >
                        {translations?.userPage?.profileCard?.securitySettings || "Security Settings"}
                    </Button>
                </Space>
                <Space direction="vertical" align="center" style={{ width: "100%", paddingTop: "20px" }}>
                    <Text type="secondary">{translations?.userPage?.profileCard?.logoutDescription}</Text>
                    <Button
                        type="primary"
                        danger
                        onClick={handleLogout}
                        onMouseEnter={handleMouseEnter}
                        style={{
                            position: 'absolute',
                            top: position ? `${position.top}%` : 'auto',
                            left: position ? `${position.left}%` : '50%',
                            transform: position ? 'none' : 'translateX(-50%)',
                            transition: 'top 0.3s ease, left 0.3s ease',
                        }}
                    >
                        {translations?.userPage?.profileCard?.logoutButton}
                    </Button>
                </Space>
            </Card>
            <Modal
                title={translations?.userPage?.profileCard?.securitySettings}
                open={isSettingsModalVisible}
                onCancel={() => setIsSettingsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsSettingsModalVisible(false)}>
                        {translations?.common?.table?.close}
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {user && user?.two_factor_method !== "totp" && (
                        <Button
                            type="primary"
                            onClick={handleActivateTOTP}
                            block
                            disabled={user?.two_factor_method !== "none"}
                        >
                            {translations?.userPage?.profileCard?.enableTOTP}
                        </Button>
                    )}

                    {user && !user.valid_email && (
                        <Button 
                            onClick={handleVerifyEmail}
                            block
                            loading={isEmailValidationLoading}
                        >
                            {translations?.userPage?.profileCard?.verifyEmail}
                        </Button>
                    )}

                    {user && user?.valid_email && (
                        <Button 
                            onClick={handleEmailAuth}
                            block
                            disabled={user?.two_factor_method !== "none"}
                        >
                            {translations?.userPage?.profileCard?.enableEmailAuth}
                        </Button>
                    )}

                    {user && user?.two_factor_method !== "none" && (
                        <Button 
                            danger 
                            onClick={handleDisable2FA}
                            block
                        >
                            {translations?.userPage?.profileCard?.disable2FA}
                        </Button>
                    )}
                </Space>
            </Modal>
            <Modal
                title={translations?.userPage?.profileCard?.setup2FATitle}
                open={isQrModalVisible}
                onCancel={() => setIsQrModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsQrModalVisible(false)}>
                        {translations?.common?.table?.cancel}
                    </Button>,
                    <Button key="continue" type="primary" onClick={handleContinue}>
                        {translations?.common?.table?.continue}
                    </Button>
                ]}
            >
                <Space direction="vertical" align="center" style={{ width: '100%', padding: '20px' }}>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} />}
                    <Text>{translations?.userPage?.profileCard?.scan2FAQRCode}</Text>
                    {modalSecret && (
                        <>
                            <Text strong>Secret Key:</Text>
                            <Text copyable>{modalSecret}</Text>
                        </>
                    )}
                </Space>
            </Modal>
        </Col>
    );
};

export default ProfileCard;
