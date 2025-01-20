import React, { useState } from "react";
import { Col, Card, Space, Avatar, Typography, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "@/Context/ContextHooks";
import { auth, instanceWithAuth } from "@Config/backend.routes";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const { Text } = Typography;

interface ProfileCardProps {
    handleLogout: () => void;
    hoverCount: number;
    setHoverCount: (count: number) => void;
    hoverLimit: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ handleLogout, hoverCount, setHoverCount, hoverLimit }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [modalSecret, setModalSecret] = useState<string>("");
    const [isQrModalVisible, setIsQrModalVisible] = useState<boolean>(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);

    const { user, translations } = useUser();
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
        // TODO: Ask server to send verification email
        navigate('/2fa');
    };

    const handleEmailAuth = () => {
        // TODO: Tell server to enable email auth
    };

    const handleDisable2FA = () => {
        instanceWithAuth.put("", { method: null })
            .then(() => {
                // TODO: update user
                setIsSettingsModalVisible(false);
            })
            .catch((error) => {
                console.error('Failed to disable 2FA:', error);
            });
    };

    const handle2FAToggle = () => {
        if (user) {
            if (!user.is2faEnabled) {
                instanceWithAuth.get(auth.twoFactorAuth.generate)
                    .then((response) => {
                        setQrCodeUrl(response.data.url);
                        setModalSecret(response.data.secret);
                        setIsQrModalVisible(true);
                        setIsSettingsModalVisible(false);
                    })
                    .catch((error) => {
                        console.error('Failed to get 2FA QR code:', error);
                    });
            }
        }
    };

    const handleContinue = () => {
        setIsQrModalVisible(false);
        window.location.href = '/2fa';
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
                title={translations?.userPage?.profileCard?.securitySettings || "Security Settings"}
                open={isSettingsModalVisible}
                onCancel={() => setIsSettingsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsSettingsModalVisible(false)}>
                        {translations?.common?.table?.close}
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                        type="primary" 
                        onClick={handle2FAToggle}
                        block
                    >
                        {translations?.userPage?.profileCard?.enableTOTP || "Enable TOTP Authentication"}
                        {/* TODO: Update translation */}
                    </Button>

                    {user && !user.isEmailVerified && (
                        <Button 
                            onClick={handleVerifyEmail}
                            block
                        >
                            {translations?.userPage?.profileCard?.verifyEmail || "Verify Email"}
                        </Button>
                    )}

                    {user && user.isEmailVerified && (
                        <Button 
                            onClick={handleEmailAuth}
                            block
                        >
                            {translations?.userPage?.profileCard?.enableEmailAuth || "Enable Email Authentication"}
                        </Button>
                    )}

                    {user && user.is2faEnabled && (
                        <Button 
                            danger 
                            onClick={handleDisable2FA}
                            block
                        >
                            {translations?.userPage?.profileCard?.disable2FA || "Disable 2FA"}
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
