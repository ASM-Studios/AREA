import React, { useState } from "react";
import { Col, Card, Space, Avatar, Typography, Button, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "@/Context/ContextHooks";
import { auth, instanceWithAuth } from "@Config/backend.routes";
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

    const { user, setUser, translations } = useUser();

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

    const handle2FAToggle = () => {
        if (user) {
            if (!user.is2faEnabled) {
                instanceWithAuth.get(auth.twoFactorAuth.generate)
                    .then((response) => {
                        console.log("2FA QR code URL:", response.data.url);
                        setQrCodeUrl(response.data.url);
                        setModalSecret(response.data.secret);
                        setIsQrModalVisible(true);
                    })
                    .catch((error) => {
                        console.error('Failed to get 2FA QR code:', error);
                    });
            } else {
                instanceWithAuth.put("", { method: null })
                    .then(() => {
                        const updatedUser = { ...user, is2faEnabled: false };
                        setUser(updatedUser);
                    })
                    .catch((error) => {
                        console.error('Failed to disable 2FA:', error);
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
                        onClick={handle2FAToggle}
                        style={{ marginTop: '10px' }}
                    >
                        {user?.is2faEnabled ? translations?.userPage?.profileCard?.disable2FAButton : translations?.userPage?.profileCard?.enable2FAButton}
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
